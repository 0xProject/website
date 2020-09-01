// tslint:disable:no-shadowed-variable
// tslint:disable:promise-function-async

import { signatureUtils } from '@0x/order-utils';
import { ECSignature, SignatureType } from '@0x/types';
import { BigNumber, signTypedDataUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import '@reach/dialog/styles.css';
import { useWeb3React } from '@web3-react/core';
import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { Button } from 'ts/components/button';
import { Input } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';
import { PreferenceSelecter } from 'ts/pages/governance/preference_selecter';
import { colors } from 'ts/style/colors';
import { configs } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { environments } from 'ts/utils/environments';

export enum VoteValue {
    Yes = 'Yes',
    No = 'No',
}

export interface VoteInfo {
    userBalance: BigNumber;
    voteValue: VoteValue;
}

interface Props {
    onDismiss?: () => void;
    onError?: (errorMessage: string) => void;
    onVoted?: (userInfo: VoteInfo) => void;
    currentBalance?: BigNumber;
    selectedAddress: string;
    zeipId: number;
    chainId: number;
}

interface State {
    isSuccessful: boolean;
    selectedAddress?: string;
    votePreference?: string;
    voteHash?: string;
    signedVote?: SignedVote;
    comment?: string;
    errorMessage?: string;
    errors: ErrorProps;
}

interface SignedVote {
    signature: string;
    from: string;
    zeip: number;
    preference: string;
}

interface FormProps {
    isSuccessful?: boolean;
    isSubmitting?: boolean;
}

interface ErrorProps {
    [key: string]: string;
}

// This is a copy of the generic form and includes a number of extra fields
// TODO remove the extraneous fields

const InputRow = styled.div`
    width: 100%;
    flex: 0 0 auto;

    @media (min-width: 768px) {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }
`;

const ButtonRow = styled(InputRow)`
    position: relative;

    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;

        button:nth-child(1) {
            order: 2;
        }

        button:nth-child(2) {
            order: 1;
            margin-bottom: 10px;
        }
    }
`;

const ButtonDisabled = styled(Button)<{ isDisabled?: boolean; disabled?: boolean }>`
    background-color: ${props => props.disabled && '#898990'};
    opacity: ${props => props.disabled && '0.4'};
`;
const Form = styled.form<FormProps>`
    position: relative;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

    opacity: ${props => props.isSuccessful && `0`};
    visibility: ${props => props.isSuccessful && `hidden`};
`;
const PreferenceWrapper = styled.div`
    margin-bottom: 30px;
`;

export const VoteForm = (props: Props) => {
    const { connector } = useWeb3React();
    const [state, setState] = React.useState<State>({
        isSuccessful: false,
        votePreference: null,
        errors: {},
    });
    const commentsRef: React.RefObject<HTMLInputElement> = React.createRef();

    const _createAndSubmitVoteAsync = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const { votePreference, comment } = state;
        const { currentBalance, selectedAddress, zeipId, chainId } = props;

        const domainType = [
            { name: 'name', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
        ];
        const voteType = [
            { name: 'preference', type: 'string' },
            { name: 'zeip', type: 'uint256' },
            { name: 'from', type: 'address' },
        ];
        const domainData = {
            name: '0x Protocol Governance',
            chainId,
            verifyingContract: getContractAddressesForChainOrThrow(chainId).exchange.toLowerCase(),
        };
        const message = {
            zeip: zeipId,
            preference: votePreference,
            from: selectedAddress,
        };
        const typedData = {
            types: {
                EIP712Domain: domainType,
                Vote: voteType,
            },
            domain: domainData,
            message,
            primaryType: 'Vote',
        };

        const voteHashBuffer = signTypedDataUtils.generateTypedDataHash(typedData);
        const voteHashHex = `0x${voteHashBuffer.toString('hex')}`;
        try {
            const signedVote = await _signVoteAsync(selectedAddress, typedData);
            // Store the signed vote
            setState({
                ...state,
                signedVote,
                voteHash: voteHashHex,
                isSuccessful: true,
            });

            const voteDomain = environments.isProduction()
                ? `https://${configs.DOMAIN_VOTE}`
                : `https://${configs.DOMAIN_VOTE_STAGING}`;
            const voteEndpoint = `${voteDomain}/v1/vote`;
            const requestBody = { ...signedVote, comment };
            const response = await fetch(voteEndpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                if (props.onVoted) {
                    props.onVoted({
                        userBalance: currentBalance,
                        voteValue: _getVoteValueFromString(votePreference),
                    });
                }
            } else {
                const responseBody = await response.json();
                const errorMessage = responseBody.reason !== undefined ? responseBody.reason : 'Unknown Error';
                _handleError(errorMessage);
            }
        } catch (err) {
            _handleError(err.message);
        }
    };

    const _handleError = (errorMessage: string): void => {
        const { onError } = props;
        onError
            ? onError(errorMessage)
            : setState({
                  ...state,
                  errors: {
                      signError: errorMessage,
                  },
                  isSuccessful: false,
              });
    };
    const _signVoteAsync = async (selectedAddress: string, typedData: any): Promise<SignedVote> => {
        const provider = await connector.getProvider();
        const web3Wrapper = new Web3Wrapper(provider);
        let signatureHex;

        try {
            signatureHex = await _eip712SignatureAsync(selectedAddress, typedData, web3Wrapper);
        } catch (err) {
            // HACK: We are unable to handle specific errors thrown since provider is not an object
            //       under our control. It could be Metamask Web3, Ethers, or any general RPC provider.
            //       We check for a user denying the signature request in a way that supports Metamask and
            //       Coinbase Wallet. Unfortunately for signers with a different error message,
            //       they will receive two signature requests.
            if (err.message.includes('User denied message signature')) {
                throw err;
            }
            // Handle the inconsistency with Metamask and send eth_sign as
            // personal_sign
            const voteHashBuffer = signTypedDataUtils.generateTypedDataHash(typedData);
            const voteHashHex = `0x${voteHashBuffer.toString('hex')}`;
            signatureHex = await signatureUtils.ecSignHashAsync(provider, voteHashHex, selectedAddress);
        }
        const signedVote = { ...typedData.message, signature: signatureHex };
        return signedVote;
    };
    const _eip712SignatureAsync = async (
        address: string,
        typedData: any,
        web3Wrapper: Web3Wrapper,
    ): Promise<string> => {
        const signature = await web3Wrapper.signTypedDataAsync(address, typedData);
        const ecSignatureRSV = _parseSignatureHexAsRSV(signature);
        const signatureBuffer = Buffer.concat([
            ethUtil.toBuffer(ecSignatureRSV.v),
            ethUtil.toBuffer(ecSignatureRSV.r),
            ethUtil.toBuffer(ecSignatureRSV.s),
            ethUtil.toBuffer(SignatureType.EIP712),
        ]);
        const signatureHex = `0x${signatureBuffer.toString('hex')}`;
        return signatureHex;
    };

    const _parseSignatureHexAsRSV = (signatureHex: string): ECSignature => {
        const { v, r, s } = ethUtil.fromRpcSig(signatureHex);
        const ecSignature: ECSignature = {
            v,
            r: ethUtil.bufferToHex(r),
            s: ethUtil.bufferToHex(s),
        };
        return ecSignature;
    };

    const _setVotePreference = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setState({
            ...state,
            votePreference: e.currentTarget.value,
        });
    };
    const _setVoteComment = (e: React.ChangeEvent<any>): void => {
        setState({
            ...state,
            comment: e.currentTarget.value,
        });
    };
    const _getVoteValueFromString = (value: string): VoteValue => {
        return VoteValue.Yes === value ? VoteValue.Yes : VoteValue.No;
    };

    const { votePreference, errors, isSuccessful } = state;
    const { currentBalance, selectedAddress, zeipId } = props;
    const bigNumberFormat = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0,
    };
    const formattedBalance = Web3Wrapper.toUnitAmount(currentBalance, constants.DECIMAL_PLACES_ZRX).toFormat(
        2,
        BigNumber.ROUND_FLOOR,
        bigNumberFormat,
    );

    return (
        <Form onSubmit={(e: React.FormEvent) => _createAndSubmitVoteAsync(e)} isSuccessful={isSuccessful}>
            <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                ZEIP-{zeipId} Vote
            </Heading>
            <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                Make sure you are informed to the best of your ability before casting your vote. It will have lasting
                implications for the 0x ecosystem.
            </Paragraph>
            <PreferenceWrapper>
                <PreferenceSelecter
                    label="Accept Proposal"
                    value={VoteValue.Yes}
                    isActive={votePreference === VoteValue.Yes}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setVotePreference(e)}
                />
                <PreferenceSelecter
                    label="Reject Proposal"
                    value={VoteValue.No}
                    isActive={votePreference === VoteValue.No}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => _setVotePreference(e)}
                />
            </PreferenceWrapper>
            <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                <strong>Voting address:</strong> {selectedAddress}
                <br />
                <strong>Voting power:</strong> {formattedBalance} ZRX
            </Paragraph>
            <InputRow>
                <Input
                    name="comments"
                    label="Leave a private message for the 0x team (Optional)"
                    type="textarea"
                    ref={commentsRef}
                    onChange={(e: React.ChangeEvent<any>) => _setVoteComment(e)}
                    errors={errors}
                />
            </InputRow>
            {errors.signError !== undefined && (
                <Paragraph isMuted={true} color={colors.red}>
                    {errors.signError}
                </Paragraph>
            )}
            <ButtonRow>
                <Button color="#5C5C5C" isNoBorder={true} isTransparent={true} type="button" onClick={props.onDismiss}>
                    Back
                </Button>
                <ButtonDisabled disabled={!votePreference}>Submit</ButtonDisabled>
            </ButtonRow>
        </Form>
    );
};
