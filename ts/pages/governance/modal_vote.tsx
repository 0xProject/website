import { ZrxTreasuryContract } from '@0x/contracts-treasury';
import { BigNumber, logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import * as React from 'react';
import styled from 'styled-components';

import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'ts/components/button';
import { ButtonClose } from 'ts/components/modals/button_close';
import { Heading, Paragraph } from 'ts/components/text';
import { Spinner } from 'ts/components/ui/spinner';
import { GlobalStyle } from 'ts/constants/globalStyle';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { ErrorModal } from 'ts/pages/governance/error_modal';
import { VoteForm, VoteInfo } from 'ts/pages/governance/vote_form';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { AccountReady, EtherscanLinkSuffixes, PoolWithStats } from 'ts/types';
import { GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { errorReporter } from 'ts/utils/error_reporter';
import { utils } from 'ts/utils/utils';

interface ModalVoteProps {
    theme?: GlobalStyle;
    isOpen?: boolean;
    onDismiss?: () => void;
    onVoted?: (voteInfo: VoteInfo) => void;
    zeipId: number;
}

interface FormProps {
    isSuccessful?: boolean;
    isSubmitting?: boolean;
}

const encodePoolId = (poolId: number) => `0x${new BigNumber(poolId).toString(16).padStart(64, '0')}`;

export const ModalVote: React.FC<ModalVoteProps> = ({ zeipId, isOpen, onDismiss, onVoted: onVoteInfoReceived }) => {
    const providerState = useSelector((state: State) => state.providerState);
    const networkId = useSelector((state: State) => state.networkId);
    const account = providerState.account as AccountReady;
    const dispatch = useDispatch();
    const apiClient = useAPIClient(networkId);

    const [currentVotingPower, setCurrentVotingPower] = React.useState(new BigNumber(0));
    const [isFetchingVotingPowerData, setIsFetchingVotingPowerData] = React.useState<boolean>(false);

    React.useEffect(() => {
        const fetchDelegatorData = async () => {
            // TODO 10x cleaner if 0x-vote exported this as an API
            const zrxToken = new ERC20TokenContract(
                getContractAddressesForChainOrThrow(networkId).zrxToken,
                providerState.web3Wrapper.getProvider(),
            );
            const [delegatorResponse, zrxBalanceBaseUnits, poolsResponse] = await Promise.all([
                apiClient.getDelegatorAsync(account.address),
                zrxToken.balanceOf(account.address).callAsync(),
                apiClient.getStakingPoolsAsync(),
            ]);
            const { zrxStaked, zrxDeposited } = delegatorResponse.forCurrentEpoch;
            const undelegated = zrxDeposited - zrxStaked;
            const stakedVotingPower = zrxStaked / 2 + undelegated;
            const operatedPools = poolsResponse.stakingPools.filter((p) => p.operatorAddress === account.address);
            // Voting Power for the operator of the pool is 0.5 * total staked
            const totalDelegatedToAccount = operatedPools
                .reduce((acc, p) => acc.plus(p.currentEpochStats.zrxStaked), new BigNumber(0))
                .dividedBy(2);
            // 1 * ZRX balance + 1 * undelegated + 0.5 * delegated + 0.5 * staked to pool account is operator of
            const votingPower = zrxBalanceBaseUnits.plus(
                Web3Wrapper.toBaseUnitAmount(
                    totalDelegatedToAccount.plus(stakedVotingPower),
                    constants.DECIMAL_PLACES_ZRX,
                ),
            );
            setCurrentVotingPower(votingPower);
        };
        if (!account.address || isFetchingVotingPowerData) {
            return;
        }
        setIsFetchingVotingPowerData(true);
        fetchDelegatorData()
            .then(() => setIsFetchingVotingPowerData(false))
            .catch((err) => {
                setIsFetchingVotingPowerData(false);
                logUtils.warn(err);
                errorReporter.report(err);
            });
    }, [account.address, apiClient, networkId, providerState.web3Wrapper]);

    const onToggleConnectWalletDialog = React.useCallback(
        (open: boolean) => {
            const dispatcher = new Dispatcher(dispatch);
            dispatcher.updateIsConnectWalletDialogOpen(open);
        },
        [dispatch],
    );

    const [isSuccessful, setSuccess] = React.useState(false);
    const onVoted = React.useCallback(
        (voteInfo: VoteInfo) => {
            setSuccess(true);
            onVoteInfoReceived(voteInfo);
        },
        [onVoteInfoReceived],
    );
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
    const [isErrorModalOpen, setErrorModalOpen] = React.useState(false);
    const onVoteError = React.useCallback((message: string) => {
        setSuccess(false);
        setErrorMessage(message);
        setErrorModalOpen(true);
    }, []);

    const onModalDismiss = React.useCallback(() => {
        setSuccess(false);
        setErrorMessage(undefined);
        setErrorModalOpen(false);
        onDismiss();
    }, [onDismiss]);

    const bigNumberFormat = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0,
    };
    const formattedBalance = Web3Wrapper.toUnitAmount(currentVotingPower, constants.DECIMAL_PLACES_ZRX).toFormat(
        2,
        BigNumber.ROUND_FLOOR,
        bigNumberFormat,
    );

    const _renderVoteFormContent = (): React.ReactNode => {
        return (
            <>
                <VoteForm
                    currentBalance={currentVotingPower}
                    selectedAddress={account.address}
                    providerState={providerState}
                    onDismiss={onModalDismiss}
                    zeipId={zeipId}
                    networkId={networkId}
                    onVoted={onVoted}
                    onError={onVoteError}
                />
            </>
        );
    };
    const _shareViaTwitterAsync = (): void => {
        const tweetText = encodeURIComponent(`I voted on ZEIP-${zeipId}! 🗳️#VoteWithZRX https://0x.org/zrx/vote`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, 'Share your vote', 'width=500,height=400');
    };

    if (!account.address && isOpen) {
        onToggleConnectWalletDialog(true);
        return <div />;
    }
    onToggleConnectWalletDialog(false);
    return (
        <>
            <DialogOverlay
                style={{ background: 'rgba(0, 0, 0, 0.75)', zIndex: 30 }}
                isOpen={isOpen}
                onDismiss={onModalDismiss}
            >
                <StyledDialogContent>
                    {!isErrorModalOpen && _renderVoteFormContent()}
                    <Confirmation isSuccessful={isSuccessful}>
                        <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                            Vote Received!
                        </Heading>
                        <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                            You voted from {account.address} with {formattedBalance} ZRX
                        </Paragraph>
                        <ButtonWrap>
                            <Button type="button" onClick={_shareViaTwitterAsync}>
                                Tweet
                            </Button>
                            <Button type="button" onClick={onModalDismiss}>
                                Done
                            </Button>
                        </ButtonWrap>
                    </Confirmation>
                    <ButtonClose onClick={onModalDismiss} />
                    <ErrorModal isOpen={isErrorModalOpen} text={errorMessage} onClose={onModalDismiss} />
                </StyledDialogContent>
            </DialogOverlay>
        </>
    );
};

export const ModalTreasuryVote: React.FC<ModalVoteProps> = ({
    zeipId,
    isOpen,
    onDismiss,
    onVoted: onVoteInfoReceived,
}) => {
    const providerState = useSelector((state: State) => state.providerState);
    const networkId = useSelector((state: State) => state.networkId);
    const account = providerState.account as AccountReady;
    const dispatch = useDispatch();

    const contract = new ZrxTreasuryContract(GOVERNOR_CONTRACT_ADDRESS.ZRX, providerState.provider);

    const [currentVotingPower, setCurrentVotingPower] = React.useState(new BigNumber(0));
    const [isFetchingVotingPowerData, setIsFetchingVotingPowerData] = React.useState<boolean>(false);
    const [operatedPools, setOperatedPools] = React.useState<PoolWithStats[]>();
    const apiClient = useAPIClient(networkId);
    React.useEffect(() => {
        const fetchVotingPower = async () => {
            const poolsResponse = await apiClient.getStakingPoolsAsync();
            const userOperatedPools = poolsResponse.stakingPools.filter((p) => p.operatorAddress === account.address);
            setOperatedPools(userOperatedPools);

            const votingPower = await contract
                .getVotingPower(
                    account.address,
                    userOperatedPools ? userOperatedPools.map((pool) => encodePoolId(parseInt(pool.poolId, 10))) : [],
                )
                .callAsync();
            const votingPowerBigNumber = new BigNumber(votingPower.toNumber());
            setCurrentVotingPower(votingPowerBigNumber);
        };

        if (!account.address || isFetchingVotingPowerData) {
            return;
        }
        setIsFetchingVotingPowerData(true);
        fetchVotingPower()
            .then(() => setIsFetchingVotingPowerData(false))
            .catch((err) => {
                setIsFetchingVotingPowerData(false);
                logUtils.warn(err);
                errorReporter.report(err);
            });
    }, [account.address, apiClient, contract]);

    const onToggleConnectWalletDialog = React.useCallback(
        (open: boolean) => {
            const dispatcher = new Dispatcher(dispatch);
            dispatcher.updateIsConnectWalletDialogOpen(open);
        },
        [dispatch],
    );

    const [isSuccessful, setSuccess] = React.useState(false);
    const [isWaitingForConfirmation, setWaitingForConfirmation] = React.useState<boolean>(false);
    const [txHash, setTxHash] = React.useState<string>(null);
    const onVoted = React.useCallback(
        (voteInfo: VoteInfo, hash?: string) => {
            setWaitingForConfirmation(true);
            setTxHash(hash);
            onVoteInfoReceived(voteInfo);
        },
        [onVoteInfoReceived],
    );

    const onTransactionSuccess = () => {
        setSuccess(true);
    };

    const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined);
    const [isErrorModalOpen, setErrorModalOpen] = React.useState(false);
    const onVoteError = React.useCallback((message: string) => {
        setSuccess(false);
        setErrorMessage(message);
        setErrorModalOpen(true);
    }, []);

    const onModalDismiss = React.useCallback(() => {
        setSuccess(false);
        setErrorMessage(undefined);
        setErrorModalOpen(false);
        onDismiss();
    }, [onDismiss]);

    const bigNumberFormat = {
        decimalSeparator: '.',
        groupSeparator: ',',
        groupSize: 3,
        secondaryGroupSize: 0,
        fractionGroupSeparator: ' ',
        fractionGroupSize: 0,
    };
    const formattedBalance = Web3Wrapper.toUnitAmount(currentVotingPower, constants.DECIMAL_PLACES_ZRX).toFormat(
        2,
        BigNumber.ROUND_FLOOR,
        bigNumberFormat,
    );

    const _renderVoteFormContent = (): React.ReactNode => {
        return (
            <>
                <VoteForm
                    currentBalance={currentVotingPower}
                    selectedAddress={account.address}
                    providerState={providerState}
                    onDismiss={onModalDismiss}
                    zeipId={zeipId}
                    networkId={networkId}
                    onVoted={onVoted}
                    onError={onVoteError}
                    isTreasuryProposal={true}
                    operatedPools={operatedPools}
                    onTransactionSuccess={onTransactionSuccess}
                />
            </>
        );
    };
    const _shareViaTwitterAsync = (): void => {
        const tweetText = encodeURIComponent(`I voted on ZEIP-${zeipId}! 🗳️#VoteWithZRX https://0x.org/zrx/vote`);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, 'Share your vote', 'width=500,height=400');
    };

    if (!account.address && isOpen) {
        onToggleConnectWalletDialog(true);
        return <div />;
    }

    onToggleConnectWalletDialog(false);

    const etherscanUrl = utils.getEtherScanLinkIfExists(txHash, networkId, EtherscanLinkSuffixes.Tx);

    return (
        <>
            <DialogOverlay
                style={{ background: 'rgba(0, 0, 0, 0.75)', zIndex: 30 }}
                isOpen={isOpen}
                onDismiss={onModalDismiss}
            >
                <StyledDialogContent>
                    {!isErrorModalOpen && _renderVoteFormContent()}
                    <Confirmation isSuccessful={isWaitingForConfirmation && !isSuccessful}>
                        <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                            Waiting for transaction confirmation!
                        </Heading>
                        <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                            <SpinnerContainer>
                                <Spinner height={100} color={colors.brandLight} />
                            </SpinnerContainer>
                            Your transaction hash is:
                            <br />
                            {txHash}
                        </Paragraph>
                        <ButtonWrap>
                            <Button type="button" href={etherscanUrl} target="_blank">
                                View Transaction
                            </Button>
                        </ButtonWrap>
                    </Confirmation>
                    <Confirmation isSuccessful={isSuccessful}>
                        <Heading color={colors.textDarkPrimary} size={34} asElement="h2">
                            Vote Received!
                        </Heading>
                        <Paragraph isMuted={true} color={colors.textDarkPrimary}>
                            You voted from {account.address} with {formattedBalance} ZRX
                        </Paragraph>
                        <ButtonWrap>
                            <Button type="button" onClick={_shareViaTwitterAsync}>
                                Tweet
                            </Button>
                            <Button type="button" onClick={onModalDismiss}>
                                Done
                            </Button>
                        </ButtonWrap>
                    </Confirmation>
                    <ButtonClose onClick={onModalDismiss} />
                    <ErrorModal isOpen={isErrorModalOpen} text={errorMessage} onClose={onModalDismiss} />
                </StyledDialogContent>
            </DialogOverlay>
        </>
    );
};

const StyledDialogContent = styled(DialogContent)`
    position: relative;
    max-width: 800px;
    background-color: #f6f6f6 !important;
    padding: 60px 60px !important;

    @media (max-width: 768px) {
        width: calc(100vw - 40px) !important;
        margin: 40px auto !important;
        padding: 30px 30px !important;
    }
`;

const Confirmation = styled.div<FormProps>`
    position: absolute;
    top: 50%;
    text-align: center;
    width: 100%;
    left: 0;
    transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    transition-delay: 0.4s;
    padding: 60px 60px;
    transform: translateY(-50%);
    opacity: ${(props) => (props.isSuccessful ? `1` : `0`)};
    visibility: ${(props) => (props.isSuccessful ? 'visible' : `hidden`)};

    p {
        max-width: 492px;
        margin-left: auto;
        margin-right: auto;
    }
`;

const ButtonWrap = styled.div`
    display: inline-block;

    @media (min-width: 768px) {
        * + * {
            margin-left: 15px;
        }
    }

    @media (max-width: 768px) {
        a,
        button {
            display: block;
            width: 220px;
        }

        * + * {
            margin-top: 15px;
        }
    }
`;

const SpinnerContainer = styled.div`
    height: 100px;
    margin-bottom: 20px;
`;
