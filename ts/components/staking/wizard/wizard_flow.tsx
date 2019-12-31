import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { formatDistanceStrict } from 'date-fns';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';
import {
    AccountReady,
    AccountState,
    Epoch,
    Network,
    PoolWithStats,
    ProviderState,
    StakingPoolRecomendation,
    TransactionLoadingState,
    UserStakingChoice,
    WebsitePaths,
} from 'ts/types';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

import { Button } from 'ts/components/button';
import { Inner } from 'ts/components/staking/wizard/inner';
import { MarketMaker } from 'ts/components/staking/wizard/market_maker';
import { NumberInput } from 'ts/components/staking/wizard/number_input';
import { Status } from 'ts/components/staking/wizard/status';
import { Spinner } from 'ts/components/ui/spinner';

import { UseAllowanceHookResult } from 'ts/hooks/use_allowance';
import { useSecondsRemaining } from 'ts/hooks/use_seconds_remaining';
import { UseStakeHookResult } from 'ts/hooks/use_stake';

import { stakingUtils } from 'ts/utils/staking_utils';

import { ApproveTokensInfoDialog } from 'ts/components/dialogs/approve_tokens_info_dialog';
import { TransactionItem } from 'ts/components/staking/wizard/transaction_item';
import { Newsletter } from 'ts/pages/staking/wizard/newsletter';

import { StakingConfirmationDialog } from 'ts/components/dialogs/staking_confirmation_dialog';
import { formatZrx, formatEther } from 'ts/utils/format_number';

const getFormattedTimeLeft = (secondsLeft: number) => {
    if (secondsLeft === 0) {
        return 'Almost done...';
    }
    const formattedSecondsLeft = formatDistanceStrict(0, secondsLeft * 1000, { unit: 'second' });
    return `${formattedSecondsLeft} left`;
};

export interface WizardFlowProps {
    providerState: ProviderState;
    onOpenConnectWalletDialog: () => void;
    networkId: Network;
    setSelectedStakingPools: React.Dispatch<React.SetStateAction<UserStakingChoice[]>>;
    selectedStakingPools: UserStakingChoice[] | undefined;
    stakingPools?: PoolWithStats[];
    currentEpochStats?: Epoch;
    nextEpochStats?: Epoch;
    stake: UseStakeHookResult;
    allowance: UseAllowanceHookResult;
    poolId?: string;
}

enum StakingPercentageValue {
    Fourth = '25%',
    Half = '50%',
    All = '100%',
}

interface ErrorButtonProps {
    message: string;
    secondaryButtonText: string;
    onClose: () => void;
    onSecondaryClick: () => void;
}

const ConnectWalletButton = styled(Button)`
    margin-bottom: 60px;
`;

const ButtonWithIcon = styled(Button)`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const SpinnerContainer = styled.span`
    display: inline-block;
    margin-right: 10px;
    height: 26px;
`;

const CenteredHeader = styled.h2`
    max-width: 440px;
    margin: 0 auto;
    font-size: 34px;
    line-height: 1.23;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 175px;
`;

const PoolsContainer = styled.div`
    overflow: scroll;
`;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    align-items: flex-start;
    flex-direction: column;

    @media (min-width: 480px) {
        flex-direction: row;
    }

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
    }

    @media (min-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 1140px) {
        flex-direction: row;
        align-items: center;
    }
`;

const InfoHeaderItem = styled.span`
    font-size: 18px;
    line-height: 1.35;

    @media (min-width: 480px) {
        font-size: 20px;
    }
`;

const ErrorButtonContainer = styled.div`
    padding: 18px 0;
    font-size: 18px;
    color: ${colors.error};
    border: 1px solid ${colors.error};
    display: flex;
    align-items: center;
    width: 100%;

    span {
        flex: 1;
    }
`;

const CloseIcon = styled(Icon)`
    path {
        fill: ${colors.error};
    }
`;

const CloseIconContainer = styled.button`
    text-align: center;
    flex: 0 0 60px;
    border: 0;
`;

const Retry = styled.button`
    max-width: 100px;
    flex: 1 1 100px;
    border: 0;
    font-size: 18px;
    font-family: 'Formular', monospace;
    border-left: 1px solid #898989;
    cursor: pointer;
`;

const NumberRound = styled.span`
    background-color: ${colors.white};
    border-radius: 50%;
    width: 34px;
    height: 34px;
    display: inline-block;
    text-align: center;
    padding: 4px 0;
    border: 1px solid #f6f6f6;
`;

const ErrorButton: React.FC<ErrorButtonProps> = props => {
    const { onSecondaryClick, message, secondaryButtonText } = props;
    return (
        <ErrorButtonContainer>
            <CloseIconContainer>
                <CloseIcon name="close" size={10} />
            </CloseIconContainer>
            <span>{message}</span>
            <Retry onClick={onSecondaryClick}>{secondaryButtonText}</Retry>
        </ErrorButtonContainer>
    );
};

const getStatus = (stakeAmount: string, stakingPools?: PoolWithStats[]): React.ReactNode => {
    if (stakeAmount === '') {
        return (
            <Status
                title="Please select an amount of staked ZRX above to see matching Staking Pool."
                linkText="or explore market maker list"
                to={WebsitePaths.Staking}
            />
        );
    }
    if (stakingPools === undefined) {
        return (
            <Status
                title="Looking for most suitable
                market makers"
                iconName="search_big"
                to={WebsitePaths.Staking}
            />
        );
    }
    if (stakingPools.length === 0) {
        return (
            <Status
                title="We didn’t find a suitable staking pool. Try again later or adjust ZRX amount."
                linkText="or explore market maker list"
                iconName="getStartedThin"
                to={WebsitePaths.Staking}
            />
        );
    }
    return null;
};

const ConnectWalletPane = ({ onOpenConnectWalletDialog }: { onOpenConnectWalletDialog: () => any }) => {
    return (
        <>
            <ConnectWalletButton color={colors.white} onClick={onOpenConnectWalletDialog}>
                Connect your wallet to start staking
            </ConnectWalletButton>
            <Status
                title="Please connect your wallet, so we can find suitable market maker."
                linkText="or explore market maker list"
                to={WebsitePaths.Staking}
            />
        </>
    );
};

export interface StakingInputPaneProps {
    setSelectedStakingPools: any;
    stakingPools: any;
    zrxBalanceBaseUnitAmount: BigNumber;
    unitAmount: number;
    onOpenConnectWalletDialog: () => any;
}

const RecommendedPoolsStakeInputPane = (props: StakingInputPaneProps) => {
    const { stakingPools, setSelectedStakingPools, zrxBalanceBaseUnitAmount, unitAmount } = props;

    const [stakeAmount, setStakeAmount] = React.useState<string>('');
    const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(undefined);

    const formattedAmount = utils.getFormattedAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
    const statusNode = getStatus(stakeAmount, stakingPools);
    const recommendedPools = stakingUtils.getRecommendedStakingPools(Number(stakeAmount), stakingPools);

    return (
        <>
            <NumberInput
                placeholder="Enter your stake"
                topLabels={[`Available: ${formattedAmount} ZRX`]}
                labels={[StakingPercentageValue.Fourth, StakingPercentageValue.Half, StakingPercentageValue.All]}
                value={stakeAmount}
                selectedLabel={selectedLabel}
                onLabelChange={(label: string) => {
                    if (label === StakingPercentageValue.Fourth) {
                        setStakeAmount(`${(unitAmount / 4).toFixed(2)}`);
                        setSelectedLabel(StakingPercentageValue.Fourth);
                    }
                    if (label === StakingPercentageValue.Half) {
                        setStakeAmount(`${(unitAmount / 2).toFixed(2)}`);
                        setSelectedLabel(StakingPercentageValue.Half);
                    }
                    if (label === StakingPercentageValue.All) {
                        setStakeAmount(`${unitAmount.toFixed(2)}`);
                        setSelectedLabel(StakingPercentageValue.All);
                    }
                }}
                onChange={(newValue: React.ChangeEvent<HTMLInputElement>) => {
                    const newAmount = newValue.target.value;
                    setStakeAmount(newAmount);
                    setSelectedLabel(undefined);
                }}
                bottomLabels={[
                    {
                        label: 'Based on your ZRX balance',
                    },
                    {
                        label: 'Change wallet',
                        onClick: props.onOpenConnectWalletDialog,
                    },
                ]}
            />
            {recommendedPools && recommendedPools.length > 0 && (
                <InfoHeader>
                    <InfoHeaderItem>
                        Recommended staking pools{' '}
                        {recommendedPools.length > 1 && <NumberRound>{recommendedPools.length}</NumberRound>}
                    </InfoHeaderItem>
                    <InfoHeaderItem>
                        <Button isWithArrow={true} color={colors.textDarkSecondary} to={WebsitePaths.Staking}>
                            Full list
                        </Button>
                    </InfoHeaderItem>
                </InfoHeader>
            )}
            {recommendedPools && (
                <PoolsContainer>
                    {recommendedPools.map(rec => {
                        return (
                            <MarketMaker
                                key={rec.pool.poolId}
                                name={rec.pool.metaData.name || utils.getAddressBeginAndEnd(rec.pool.operatorAddress)}
                                collectedFees={rec.pool.currentEpochStats.totalProtocolFeesGeneratedInEth}
                                rewards={1 - rec.pool.nextEpochStats.approximateStakeRatio}
                                staked={rec.pool.nextEpochStats.approximateStakeRatio}
                                iconUrl={rec.pool.metaData.logoUrl}
                                website={rec.pool.metaData.websiteUrl}
                                difference={rec.zrxAmount}
                            />
                        );
                    })}
                </PoolsContainer>
            )}
            {statusNode}
            {recommendedPools && recommendedPools.length > 0 && (
                <ButtonWithIcon onClick={() => setSelectedStakingPools(recommendedPools)} color={colors.white}>
                    Proceed to staking
                </ButtonWithIcon>
            )}
        </>
    );
};

export interface MarketMakerStakeInputPaneProps {
    setSelectedStakingPools: React.Dispatch<React.SetStateAction<StakingPoolRecomendation[]>>;
    stakingPools: PoolWithStats[];
    zrxBalanceBaseUnitAmount: BigNumber;
    unitAmount: number;
    onOpenConnectWalletDialog: () => any;
    poolId: string;
}

const MarketMakerStakeInputPane = (props: MarketMakerStakeInputPaneProps) => {
    const [stakeAmount, setStakeAmount] = React.useState<string>('');
    const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(undefined);

    const { stakingPools, setSelectedStakingPools, zrxBalanceBaseUnitAmount, unitAmount } = props;

    const formattedAmount = formatZrx(props.zrxBalanceBaseUnitAmount).formatted;

    if (!stakingPools) {
        return null;
    }

    const marketMakerPool = _.find(stakingPools, p => p.poolId === props.poolId);

    if (!marketMakerPool) {
        // TODO(johnrjj) error state
        return null;
    }

    return (
        <>
            <NumberInput
                placeholder="Enter your stake"
                topLabels={[`Available: ${formattedAmount} ZRX`]}
                labels={[StakingPercentageValue.Fourth, StakingPercentageValue.Half, StakingPercentageValue.All]}
                value={stakeAmount}
                selectedLabel={selectedLabel}
                onLabelChange={(label: string) => {
                    if (label === StakingPercentageValue.Fourth) {
                        setStakeAmount(`${(unitAmount / 4).toFixed(2)}`);
                        setSelectedLabel(StakingPercentageValue.Fourth);
                    }
                    if (label === StakingPercentageValue.Half) {
                        setStakeAmount(`${(unitAmount / 2).toFixed(2)}`);
                        setSelectedLabel(StakingPercentageValue.Half);
                    }
                    if (label === StakingPercentageValue.All) {
                        setStakeAmount(`${unitAmount.toFixed(2)}`);
                        setSelectedLabel(StakingPercentageValue.All);
                    }
                }}
                onChange={(newValue: React.ChangeEvent<HTMLInputElement>) => {
                    const newAmount = newValue.target.value;
                    setStakeAmount(newAmount);
                    setSelectedLabel(undefined);
                }}
                bottomLabels={[
                    {
                        label: 'Based on your ZRX balance',
                    },
                    {
                        label: 'Change wallet',
                        onClick: props.onOpenConnectWalletDialog,
                    },
                ]}
            />
            <PoolsContainer>
                <MarketMaker
                    key={marketMakerPool.poolId}
                    name={marketMakerPool.metaData.name || utils.getAddressBeginAndEnd(marketMakerPool.operatorAddress)}
                    collectedFees={formatEther(marketMakerPool.currentEpochStats.totalProtocolFeesGeneratedInEth).formatted}
                    rewards={1 - marketMakerPool.nextEpochStats.approximateStakeRatio}
                    staked={marketMakerPool.nextEpochStats.approximateStakeRatio}
                    iconUrl={marketMakerPool.metaData.logoUrl}
                    website={marketMakerPool.metaData.websiteUrl}
                    difference={''}
                />
            </PoolsContainer>
            {marketMakerPool && (
                <ButtonWithIcon
                    onClick={() =>
                        setSelectedStakingPools([
                            {
                                zrxAmount: Number(stakeAmount),
                                pool: marketMakerPool,
                            },
                        ])
                    }
                    color={colors.white}
                >
                    Proceed to staking
                </ButtonWithIcon>
            )}
        </>
    );
};

export interface StartStakingProps {
    providerState: ProviderState;
    stake: UseStakeHookResult;
    allowance: UseAllowanceHookResult;
    selectedStakingPools: UserStakingChoice[] | undefined;
    nextEpochStats?: Epoch;
    address?: string;
}

// Core
const StartStaking: React.FC<StartStakingProps> = props => {
    const { selectedStakingPools, stake, allowance, address, nextEpochStats } = props;

    const [isApproveTokenModalOpen, setIsApproveTokenModalOpen] = React.useState(false);
    const [isStakingConfirmationModalOpen, setIsStakingConfirmationModalOpen] = React.useState(false);

    const timeRemainingForAllowanceApproval = useSecondsRemaining(allowance.estimatedTransactionFinishTime);
    const timeRemainingForStakingTransaction = useSecondsRemaining(stake.estimatedTransactionFinishTime);

    if (selectedStakingPools && stake.result) {
        // TODO needs the info header (start staking + begins in n days)
        return <Newsletter />;
    }

    // Determine button to show based on state
    let ActiveButon = null;
    if (allowance.loadingState) {
        if (
            allowance.loadingState === TransactionLoadingState.WaitingForSignature ||
            allowance.loadingState === TransactionLoadingState.WaitingForTransaction
        ) {
            ActiveButon = (
                <ButtonWithIcon
                    isTransparent={true}
                    borderColor="#DFE7E1"
                    color={colors.textDarkSecondary}
                    isDisabled={true}
                >
                    <SpinnerContainer>
                        <Spinner height={22} color="#BEBEBE" />
                    </SpinnerContainer>
                    <span>
                        {allowance.loadingState === TransactionLoadingState.WaitingForSignature
                            ? 'Waiting for signature'
                            : getFormattedTimeLeft(timeRemainingForAllowanceApproval)
                        }
                    </span>
                </ButtonWithIcon>
            );
        } else if (allowance.loadingState === TransactionLoadingState.Failed) {
            ActiveButon = (
                <ErrorButton
                    message={'Allowance transaction aborted'}
                    secondaryButtonText={'Retry'}
                    onClose={() => {
                        /*noop*/
                    }}
                    onSecondaryClick={() => allowance.setAllowance()}
                />
            );
        }
    }
    if (stake.loadingState) {
        if (
            stake.loadingState === TransactionLoadingState.WaitingForSignature ||
            stake.loadingState === TransactionLoadingState.WaitingForTransaction
        ) {
            ActiveButon = (
                <ButtonWithIcon
                    isTransparent={true}
                    borderColor="#DFE7E1"
                    color={colors.textDarkSecondary}
                    isDisabled={true}
                >
                    <SpinnerContainer>
                        <Spinner height={22} color="#BEBEBE" />
                    </SpinnerContainer>
                    <span>
                        {stake.loadingState === TransactionLoadingState.WaitingForSignature
                            ? 'Waiting for signature'
                            : getFormattedTimeLeft(timeRemainingForStakingTransaction)
                        }
                    </span>
                </ButtonWithIcon>
            );
        } else if (stake.loadingState === TransactionLoadingState.Failed) {
            ActiveButon = (
                <ErrorButton
                    message={'Transaction aborted'}
                    secondaryButtonText={'Retry'}
                    onClose={() => {
                        /*noop*/
                    }}
                    onSecondaryClick={() =>
                        stake.depositAndStake(
                            selectedStakingPools.map(recommendation => ({
                                poolId: recommendation.pool.poolId,
                                zrxAmount: recommendation.zrxAmount,
                            })),
                        )
                    }
                />
            );
        }
    }
    if (!ActiveButon) {
        ActiveButon = (
            <ButtonWithIcon
                onClick={async () => {
                    const allowanceBaseUnits =
                        (props.providerState.account as AccountReady).zrxAllowanceBaseUnitAmount || new BigNumber(0);

                    if (allowanceBaseUnits.isLessThan(constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS)) {
                        setIsApproveTokenModalOpen(true);
                        allowance.setAllowance();
                    } else {
                        setIsStakingConfirmationModalOpen(true);
                    }
                }}
                color={colors.white}
            >
                Start staking
            </ButtonWithIcon>
        );
    }

    if (selectedStakingPools) {
        // Does this suffer from rounding problems ?
        const stakingAmountTotalComputed = formatZrx(selectedStakingPools.reduce((total, cur) => {
            const newTotal = total.plus(new BigNumber(cur.zrxAmount));
            return newTotal;
        }, new BigNumber(0)));
        const stakingStartsFormattedTime = formatDistanceStrict(
            new Date(),
            new Date(nextEpochStats.epochStart.timestamp),
        );
        return (
            <>
                <ApproveTokensInfoDialog
                    isOpen={isApproveTokenModalOpen}
                    onDismiss={() => setIsApproveTokenModalOpen(false)}
                    onButtonClick={() => setIsApproveTokenModalOpen(false)}
                />
                <StakingConfirmationDialog
                    isOpen={isStakingConfirmationModalOpen}
                    onDismiss={() => setIsStakingConfirmationModalOpen(false)}
                    onButtonClick={() => {
                        stake.depositAndStake(
                            selectedStakingPools.map(recommendation => ({
                                poolId: recommendation.pool.poolId,
                                zrxAmount: recommendation.zrxAmount,
                            })),
                        );

                        setIsStakingConfirmationModalOpen(false);
                    }}
                />
                <InfoHeader>
                    <InfoHeaderItem>Start staking</InfoHeaderItem>
                    <InfoHeaderItem style={{ color: colors.textDarkSecondary }}>
                        Begins in {stakingStartsFormattedTime}
                    </InfoHeaderItem>
                </InfoHeader>
                <Inner>
                    <CenteredHeader>
                        {stake.loadingState === TransactionLoadingState.WaitingForSignature
                            ? `Please confirm in ${props.providerState.displayName || 'wallet'}`
                            : stake.loadingState === TransactionLoadingState.WaitingForTransaction
                            ? `Locking your tokens into staking pool`
                            : // Default case
                              `You're delegating ${stakingAmountTotalComputed} ZRX to ${
                                  selectedStakingPools.length > 1
                                      ? `${selectedStakingPools.length} pools`
                                      : `${selectedStakingPools[0].pool.metaData.name || '1 pool'}`
                              }`}
                    </CenteredHeader>
                    {selectedStakingPools &&
                        selectedStakingPools.map(stakingPool => {
                            return (
                                <TransactionItem
                                    key={stakingPool.pool.poolId}
                                    marketMakerId={utils.getAddressBeginAndEnd(stakingPool.pool.operatorAddress)}
                                    selfId={utils.getAddressBeginAndEnd(address)}
                                    sendAmount={`${stakingPool.zrxAmount} ZRX`}
                                    selfIconUrl={'/images/toshi_logo.jpg'}
                                    receiveAmount="Staking rewards"
                                    marketMakerName={stakingPool.pool.metaData.name}
                                    marketMakerIconUrl={stakingPool.pool.metaData.logoUrl || '/images/toshi_logo.jpg'}
                                    isActive={true}
                                />
                            );
                        })}
                    {ActiveButon}
                </Inner>
            </>
        );
    }
    return null;
};

export const WizardFlow: React.FC<WizardFlowProps> = ({
    setSelectedStakingPools,
    selectedStakingPools,
    stakingPools,
    poolId,
    stake,
    allowance,
    providerState,
    onOpenConnectWalletDialog,
    nextEpochStats,
}) => {
    if (providerState.account.state !== AccountState.Ready) {
        return <ConnectWalletPane onOpenConnectWalletDialog={onOpenConnectWalletDialog} />;
    }

    const { zrxBalanceBaseUnitAmount } = providerState.account;

    if (!zrxBalanceBaseUnitAmount) {
        return <Status title="" />;
    }

    const unitAmount = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX).toNumber();

    if (unitAmount < 1) {
        return (
            <Status
                title="You have no ZRX balance. You will need some to stake."
                linkText="Go buy some ZRX"
                linkUrl={`https://www.rexrelay.com/instant/?defaultSelectedAssetData=${constants.ZRX_ASSET_DATA}`}
            />
        );
    }

    // Coming from market maker entry
    if (!selectedStakingPools && poolId) {
        return (
            <MarketMakerStakeInputPane
                poolId={poolId}
                unitAmount={unitAmount}
                stakingPools={stakingPools}
                onOpenConnectWalletDialog={onOpenConnectWalletDialog}
                setSelectedStakingPools={setSelectedStakingPools}
                zrxBalanceBaseUnitAmount={zrxBalanceBaseUnitAmount}
            />
        );
    }

    // Coming from wizard/recommendation entry
    if (!selectedStakingPools || providerState.account.state !== AccountState.Ready) {
        return (
            <RecommendedPoolsStakeInputPane
                onOpenConnectWalletDialog={onOpenConnectWalletDialog}
                setSelectedStakingPools={setSelectedStakingPools}
                stakingPools={stakingPools}
                unitAmount={unitAmount}
                zrxBalanceBaseUnitAmount={zrxBalanceBaseUnitAmount}
            />
        );
    }
    return (
        <StartStaking
            address={providerState.account.address}
            allowance={allowance}
            stake={stake}
            nextEpochStats={nextEpochStats}
            providerState={providerState}
            selectedStakingPools={selectedStakingPools}
        />
    );
    // tslint:disable-next-line: max-file-line-count
};
