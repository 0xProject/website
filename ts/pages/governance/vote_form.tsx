import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ZrxTreasuryContract } from '@0x/contracts-treasury';
import { signatureUtils } from '@0x/order-utils';
import { MetamaskSubprovider } from '@0x/subproviders';
import { ECSignature, SignatureType } from '@0x/types';
import { BigNumber, signTypedDataUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import '@reach/dialog/styles.css';
import * as ethUtil from 'ethereumjs-util';
import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Input } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';
import { PreferenceSelecter } from 'ts/pages/governance/preference_selecter';
import { State as ReduxState } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { Network, PoolWithStats, Providers, ProviderState } from 'ts/types';
import { backendClient } from 'ts/utils/backend_client';
import { configs, GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { environments } from 'ts/utils/environments';
import { utils } from 'ts/utils/utils';

export enum VoteValue {
    Yes = 'Yes',
    No = 'No',
}

interface ConnectedState {
    providerState: ProviderState;
    networkId: Network;
}

export interface VoteInfo {
    userBalance: BigNumber;
    voteValue: VoteValue;
}

const encodePoolId = (poolId: number) => `0x${new BigNumber(poolId).toString(16).padStart(64, '0')}`;

interface Props {
    onDismiss?: () => void;
    onError?: (errorMessage: string) => void;
    onVoted?: (userInfo: VoteInfo, txHash?: string) => void;
    onTransactionSuccess?: () => void;
    currentBalance?: BigNumber;
    providerState: ProviderState;
    selectedAddress: string;
    zeipId: number;
    networkId: number;
    isTreasuryProposal?: boolean;
    operatedPools?: PoolWithStats[];
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
class VoteFormComponent extends React.Component<Props> {
    public static defaultProps = {
        currentBalance: new BigNumber(0),
        isSuccessful: false,
        errors: {},
    };
    public networkId: number;
    public state: State = {
        isSuccessful: false,
        votePreference: null,
        errors: {},
    };
    // shared fields
    public commentsRef: React.RefObject<HTMLInputElement> = React.createRef();
    public constructor(props: Props) {
        super(props);
    }
    public render(): React.ReactNode {
        const { votePreference, errors, isSuccessful } = this.state;
        const { currentBalance, selectedAddress, zeipId, isTreasuryProposal = false } = this.props;
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
            <Form
                onSubmit={isTreasuryProposal ? this._castVote.bind(this) : this._createAndSubmitVoteAsync.bind(this)}
                isSuccessful={isSuccessful}
            >
                <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                    {isTreasuryProposal ? 'Vote' : `ZEIP-${zeipId} Vote`}
                </Heading>
                <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                    Make sure you are informed to the best of your ability before casting your vote. It will have
                    lasting implications for the 0x ecosystem.
                </Paragraph>
                <PreferenceWrapper>
                    <PreferenceSelecter
                        label="Accept Proposal"
                        value={VoteValue.Yes}
                        isActive={votePreference === VoteValue.Yes}
                        onChange={this._setVotePreference.bind(this)}
                    />
                    <PreferenceSelecter
                        label="Reject Proposal"
                        value={VoteValue.No}
                        isActive={votePreference === VoteValue.No}
                        onChange={this._setVotePreference.bind(this)}
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
                        ref={this.commentsRef}
                        onChange={this._setVoteComment.bind(this)}
                        errors={errors}
                    />
                </InputRow>
                {errors.signError !== undefined && (
                    <Paragraph isMuted={true} color={colors.red}>
                        {errors.signError}
                    </Paragraph>
                )}
                <ButtonRow>
                    <Button
                        color="#5C5C5C"
                        isNoBorder={true}
                        isTransparent={true}
                        type="button"
                        onClick={this.props.onDismiss}
                    >
                        Back
                    </Button>
                    <ButtonDisabled disabled={!votePreference}>Submit</ButtonDisabled>
                </ButtonRow>
            </Form>
        );
    }
    private readonly _createAndSubmitVoteAsync = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const { votePreference, comment } = this.state;
        const { currentBalance, selectedAddress, zeipId, networkId } = this.props;

        const chainId = networkId;
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
            const signedVote = await this._signVoteAsync(selectedAddress, typedData);
            // Store the signed vote
            this.setState((prevState) => ({
                ...prevState,
                signedVote,
                voteHash: voteHashHex,
                isSuccessful: true,
            }));

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
                if (this.props.onVoted) {
                    this.props.onVoted({
                        userBalance: currentBalance,
                        voteValue: this._getVoteValueFromString(votePreference),
                    });
                }
            } else {
                const responseBody = await response.json();
                const errorMessage = responseBody.reason !== undefined ? responseBody.reason : 'Unknown Error';
                this._handleError(errorMessage);
            }
        } catch (e) {
            const err = utils.maybeWrapInError(e);
            this._handleError(err.message);
        }
    };
    private readonly _castVote = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
            const {
                zeipId: proposalId,
                operatedPools,
                providerState,
                selectedAddress,
                currentBalance,
                onVoted,
                onTransactionSuccess,
            } = this.props;
            const proposalIdBigNumber = new BigNumber(proposalId);

            const contract = new ZrxTreasuryContract(GOVERNOR_CONTRACT_ADDRESS.ZRX, providerState.provider);

            const { votePreference } = this.state;

            const localStorageSpeed = localStorage.getItem('gas-speed');
            const gasInfo = await backendClient.getGasInfoAsync(localStorageSpeed);

            const txPromise = contract
                .castVote(
                    proposalIdBigNumber,
                    votePreference === VoteValue.Yes,
                    operatedPools ? operatedPools.map((pool) => encodePoolId(parseInt(pool.poolId, 10))) : [],
                )
                .awaitTransactionSuccessAsync({
                    from: selectedAddress,
                    maxFeePerGas: gasInfo.maxFeePerGas,
                    maxPriorityFeePerGas: gasInfo.maxPriorityFeePerGas,
                });
            const txHash = await txPromise.txHashPromise;
            if (onVoted) {
                this.setState({
                    isSuccessful: true,
                    voteHash: txHash,
                });
                onVoted(
                    {
                        userBalance: currentBalance,
                        voteValue: this._getVoteValueFromString(votePreference),
                    },
                    txHash,
                );
            }

            await txPromise;
            if (onTransactionSuccess) {
                onTransactionSuccess();
            }
        } catch (e) {
            const err = utils.maybeWrapInError(e);
            this._handleError(err.message);
        }
    };
    private _handleError(errorMessage: string): void {
        const { onError } = this.props;
        onError
            ? onError(errorMessage)
            : this.setState({
                  errors: {
                      signError: errorMessage,
                  },
                  isSuccessful: false,
              });
    }
    private async _signVoteAsync(selectedAddress: string, typedData: any): Promise<SignedVote> {
        const { web3Wrapper, providerType } = this.props.providerState;
        let signatureHex;

        try {
            signatureHex = await this._eip712SignatureAsync(selectedAddress, typedData, web3Wrapper);
        } catch (e) {
            const err = utils.maybeWrapInError(e);
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
            const provider =
                providerType === Providers.Metamask
                    ? new MetamaskSubprovider(web3Wrapper.getProvider())
                    : web3Wrapper.getProvider();
            const voteHashBuffer = signTypedDataUtils.generateTypedDataHash(typedData);
            const voteHashHex = `0x${voteHashBuffer.toString('hex')}`;
            signatureHex = await signatureUtils.ecSignHashAsync(provider, voteHashHex, selectedAddress);
        }
        const signedVote = { ...typedData.message, signature: signatureHex };
        return signedVote;
    }
    private readonly _eip712SignatureAsync = async (
        address: string,
        typedData: any,
        web3Wrapper: Web3Wrapper,
    ): Promise<string> => {
        const signature = await web3Wrapper.signTypedDataAsync(address, typedData);
        const ecSignatureRSV = this._parseSignatureHexAsRSV(signature);
        const signatureBuffer = Buffer.concat([
            ethUtil.toBuffer(ecSignatureRSV.v),
            ethUtil.toBuffer(ecSignatureRSV.r),
            ethUtil.toBuffer(ecSignatureRSV.s),
            ethUtil.toBuffer(SignatureType.EIP712),
        ]);
        const signatureHex = `0x${signatureBuffer.toString('hex')}`;
        return signatureHex;
    };
    private _parseSignatureHexAsRSV(signatureHex: string): ECSignature {
        const { v, r, s } = ethUtil.fromRpcSig(signatureHex);
        const ecSignature: ECSignature = {
            v,
            r: ethUtil.bufferToHex(r),
            s: ethUtil.bufferToHex(s),
        };
        return ecSignature;
    }
    private _setVotePreference(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            votePreference: e.currentTarget.value,
        });
    }
    private _setVoteComment(e: React.ChangeEvent<any>): void {
        this.setState({
            comment: e.currentTarget.value,
        });
    }
    private _getVoteValueFromString(value: string): VoteValue {
        return VoteValue.Yes === value ? VoteValue.Yes : VoteValue.No;
    }
}

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
    background-color: ${(props) => props.disabled && '#898990'};
    opacity: ${(props) => props.disabled && '0.4'};
`;
const Form = styled.form<FormProps>`
    position: relative;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

    opacity: ${(props) => props.isSuccessful && `0`};
    visibility: ${(props) => props.isSuccessful && `hidden`};
`;
const PreferenceWrapper = styled.div`
    margin-bottom: 30px;
`;

const mapStateToProps = (state: ReduxState, _ownProps: Props): ConnectedState => ({
    providerState: state.providerState,
    networkId: state.networkId,
});

export const VoteForm = connect(mapStateToProps, null)(VoteFormComponent);
