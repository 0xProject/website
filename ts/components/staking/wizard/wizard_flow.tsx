import { BigNumber } from '@0x/utils';
import { formatDistanceStrict } from 'date-fns';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';
import {
    AccountReady,
    Epoch,
    Network,
    PoolWithStats,
    ProviderState,
    StakingPoolRecomendation,
    TransactionLoadingState,
    UserStakingChoice,
    WebsitePaths,
} from 'ts/types';

import { Button } from 'ts/components/button';
import { Inner } from 'ts/components/staking/wizard/inner';
import { MarketMaker } from 'ts/components/staking/wizard/market_maker';
import { NumberInput } from 'ts/components/staking/wizard/number_input';
import { Status } from 'ts/components/staking/wizard/status';
import { Paragraph } from 'ts/components/text';
import { Spinner } from 'ts/components/ui/spinner';
import { UnlockIcon } from 'ts/components/ui/unlock_icon';

import { UseAllowanceHookResult } from 'ts/hooks/use_allowance';
import { useSecondsRemaining } from 'ts/hooks/use_seconds_remaining';
import { UseStakeHookResult } from 'ts/hooks/use_stake';

import { Newsletter } from 'ts/pages/staking/wizard/newsletter';

import { constants } from 'ts/utils/constants';
import { formatZrx } from 'ts/utils/format_number';
import { stakingUtils } from 'ts/utils/staking_utils';

import { analytics } from 'ts/utils/analytics';

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

    &:hover {
        cursor: ${props => props.isDisabled && 'not-allowed'};
    }
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

const getStatus = (stakeAmount: number, stakingPools?: PoolWithStats[]): React.ReactNode => {
    if (stakeAmount <= 0) {
        return (
            <Status
                title="Please select an amount of ZRX above and find Staking Pools."
                linkText="or explore the full list"
                to={WebsitePaths.Staking}
            />
        );
    }
    if (stakingPools === undefined) {
        return (
            <Status
                title="Looking for most suitable
                staking pools"
                iconName="search_big"
                to={WebsitePaths.Staking}
            />
        );
    }
    if (stakingPools.length === 0) {
        return (
            <Status
                title="We didn’t find a suitable staking pool. Try again later or adjust ZRX amount."
                linkText="or explore the list"
                iconName="getStartedThin"
                to={WebsitePaths.Staking}
            />
        );
    }
    return null;
};

export const ConnectWalletPane: React.FC<{ onOpenConnectWalletDialog: () => any }> = ({
    onOpenConnectWalletDialog,
}) => {
    return (
        <>
            <ConnectWalletButton color={colors.white} onClick={onOpenConnectWalletDialog}>
                Connect your wallet to start staking
            </ConnectWalletButton>
            <Status
                title="Please connect your wallet, so we can find suitable Staking Pools."
                linkText="or explore the list"
                to={WebsitePaths.Staking}
            />
        </>
    );
};

export interface StakingInputPaneProps {
    setSelectedStakingPools: any;
    stakingPools: any;
    zrxBalance: BigNumber;
    onOpenConnectWalletDialog: () => any;
    onGoToNextStep: () => void;
}

type AmountTrackingValue = '25%' | '50%' | '100%' | 'custom';
const trackStakingAmountSelected = _.debounce(
    (value: AmountTrackingValue): void => {
        analytics.track(constants.STAKING.TRACKING.STAKING_AMOUNT_EVENT, { value });
    },
    1000,
    { trailing: true },
);

export const RecommendedPoolsStakeInputPane = (props: StakingInputPaneProps) => {
    const { stakingPools, setSelectedStakingPools, zrxBalance } = props;

    const [stakeAmount, setStakeAmount] = React.useState<string>('');
    const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(undefined);

    const roundedZrxBalance = formatZrx(zrxBalance).roundedValue;
    const roundedStakeAmount = formatZrx(stakeAmount, { removeComma: true }).roundedValue;
    const statusNode = getStatus(roundedStakeAmount, stakingPools);
    const recommendedPools = stakingUtils.getRecommendedStakingPools(roundedStakeAmount, stakingPools);

    const isStakeAmountAboveBalance = zrxBalance.isLessThan(roundedStakeAmount);
    const isZeroAmountStakeInput = stakeAmount && roundedStakeAmount <= 0;

    return (
        <>
            <NumberInput
                isError={isStakeAmountAboveBalance || isZeroAmountStakeInput}
                placeholder="Enter your stake"
                topLabels={[`Available: ${roundedZrxBalance} ZRX`]}
                labels={[StakingPercentageValue.Fourth, StakingPercentageValue.Half, StakingPercentageValue.All]}
                value={stakeAmount}
                selectedLabel={selectedLabel}
                onLabelChange={(label: string) => {
                    if (label === StakingPercentageValue.Fourth) {
                        setStakeAmount(formatZrx(roundedZrxBalance / 4, { removeComma: true }).formatted);
                        setSelectedLabel(StakingPercentageValue.Fourth);
                        trackStakingAmountSelected(StakingPercentageValue.Fourth);
                    }
                    if (label === StakingPercentageValue.Half) {
                        setStakeAmount(formatZrx(roundedZrxBalance / 2, { removeComma: true }).formatted);
                        setSelectedLabel(StakingPercentageValue.Half);
                        trackStakingAmountSelected(StakingPercentageValue.Half);
                    }
                    if (label === StakingPercentageValue.All) {
                        setStakeAmount(formatZrx(roundedZrxBalance, { removeComma: true }).formatted);
                        setSelectedLabel(StakingPercentageValue.All);
                        trackStakingAmountSelected(StakingPercentageValue.All);
                    }
                }}
                onChange={(newValue: React.ChangeEvent<HTMLInputElement>) => {
                    const newAmount = newValue.target.value;
                    setStakeAmount(newAmount);
                    setSelectedLabel(undefined);
                    trackStakingAmountSelected('custom');
                }}
                bottomLabels={[]}
            />
            {recommendedPools && recommendedPools.length > 0 && (
                <InfoHeader>
                    <InfoHeaderItem>
                        {recommendedPools.length > 1 ? 'Selected staking pools' : 'Selected staking pool'}{' '}
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
                                poolId={rec.pool.poolId}
                                operatorAddress={rec.pool.operatorAddress}
                                key={rec.pool.poolId}
                                name={stakingUtils.getPoolDisplayName(rec.pool)}
                                collectedFees={rec.pool.currentEpochStats.totalProtocolFeesGeneratedInEth}
                                rewardsShared={1 - rec.pool.currentEpochStats.operatorShare}
                                staked={rec.pool.currentEpochStats.approximateStakeRatio}
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
                <ButtonWithIcon
                    isDisabled={isZeroAmountStakeInput || !stakeAmount}
                    onClick={() => {
                        setSelectedStakingPools(recommendedPools);
                        props.onGoToNextStep();
                    }}
                    color={colors.white}
                >
                    Next
                </ButtonWithIcon>
            )}
        </>
    );
};

export interface MarketMakerStakeInputPaneProps {
    setSelectedStakingPools: React.Dispatch<React.SetStateAction<StakingPoolRecomendation[]>>;
    stakingPools: PoolWithStats[];
    zrxBalance: BigNumber;
    onOpenConnectWalletDialog: () => any;
    onGoToNextStep: () => any;
    poolId: string;
}

export const MarketMakerStakeInputPane: React.FC<MarketMakerStakeInputPaneProps> = props => {
    const [stakeAmount, setStakeAmount] = React.useState<string>('');
    const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(undefined);

    const { stakingPools, setSelectedStakingPools, zrxBalance, poolId, onOpenConnectWalletDialog } = props;

    const roundedZrxBalance = formatZrx(zrxBalance).roundedValue;
    const roundedStakeAmount = formatZrx(stakeAmount).roundedValue;

    if (!stakingPools) {
        return null;
    }

    const marketMakerPool = _.find(stakingPools, p => p.poolId === poolId);

    if (!marketMakerPool) {
        // TODO(johnrjj) error state
        return null;
    }

    const isStakeAmountAboveBalance = zrxBalance.isLessThan(roundedStakeAmount);
    const isZeroAmountStakeInput = stakeAmount && roundedStakeAmount <= 0;

    return (
        <>
            <NumberInput
                isError={isStakeAmountAboveBalance || isZeroAmountStakeInput}
                placeholder="Enter your stake"
                topLabels={[`Available: ${roundedZrxBalance} ZRX`]}
                labels={[StakingPercentageValue.Fourth, StakingPercentageValue.Half, StakingPercentageValue.All]}
                value={stakeAmount}
                selectedLabel={selectedLabel}
                onLabelChange={(label: string) => {
                    if (label === StakingPercentageValue.Fourth) {
                        setStakeAmount(formatZrx(roundedZrxBalance / 4, { removeComma: true }).formatted);
                        setSelectedLabel(StakingPercentageValue.Fourth);
                    }
                    if (label === StakingPercentageValue.Half) {
                        setStakeAmount(formatZrx(roundedZrxBalance / 2, { removeComma: true }).formatted);
                        setSelectedLabel(StakingPercentageValue.Half);
                    }
                    if (label === StakingPercentageValue.All) {
                        setStakeAmount(formatZrx(roundedZrxBalance, { removeComma: true }).formatted);
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
                        onClick: onOpenConnectWalletDialog,
                    },
                ]}
            />
            <PoolsContainer>
                <MarketMaker
                    operatorAddress={marketMakerPool.operatorAddress}
                    poolId={marketMakerPool.poolId}
                    key={marketMakerPool.poolId}
                    name={stakingUtils.getPoolDisplayName(marketMakerPool)}
                    collectedFees={marketMakerPool.currentEpochStats.totalProtocolFeesGeneratedInEth}
                    rewardsShared={1 - marketMakerPool.currentEpochStats.operatorShare}
                    staked={marketMakerPool.currentEpochStats.approximateStakeRatio}
                    iconUrl={marketMakerPool.metaData.logoUrl}
                    website={marketMakerPool.metaData.websiteUrl}
                    difference={roundedStakeAmount}
                />
            </PoolsContainer>
            {marketMakerPool && (
                <ButtonWithIcon
                    isDisabled={isZeroAmountStakeInput || !stakeAmount}
                    onClick={() => {
                        setSelectedStakingPools([
                            {
                                zrxAmount: Number(stakeAmount),
                                pool: marketMakerPool,
                            },
                        ]);
                        props.onGoToNextStep();
                    }}
                    color={colors.white}
                >
                    Next
                </ButtonWithIcon>
            )}
        </>
    );
};

const trackStartStakingScreenViewed = _.once(() => {
    analytics.track(constants.STAKING.TRACKING.START_STAKING_SCREEN_VIEWED);
});

const DescriptionContainer = styled.div`
    margin-bottom: 30px;
`;

const Description = styled.div`
    font-size: 20px;
    line-height: 27px;
    color: ${colors.black};
    margin-bottom: 8px;
`;

const DescriptionLabel = styled.div`
    font-weight: 300;
    font-size: 17px;
    line-height: 23px;
    color: ${colors.textDarkSecondary};
`;

export interface StartStakingProps {
    providerState: ProviderState;
    stake: UseStakeHookResult;
    selectedStakingPools: UserStakingChoice[] | undefined;
    nextEpochStats?: Epoch;
}

// Core
export const StartStaking: React.FC<StartStakingProps> = props => {
    const { selectedStakingPools, stake, nextEpochStats, providerState } = props;

    const timeRemainingForStakingTransaction = useSecondsRemaining(stake.estimatedTransactionFinishTime);

    trackStartStakingScreenViewed();

    // Implies success! Show success confirmation/newsletter
    if (selectedStakingPools && stake.result) {
        // TODO(johnrjj) Needs info header (start staking + begins in n days)
        return <Newsletter />;
    }

    if (!selectedStakingPools) {
        // TODO(johnrjj) - Error state
        return null;
    }

    const stakingAmountRounded = formatZrx(
        selectedStakingPools.reduce((total, cur) => {
            const newTotal = total.plus(new BigNumber(cur.zrxAmount));
            return newTotal;
        }, new BigNumber(0)),
    ).minimized;
    const stakingStartsFormattedTime = formatDistanceStrict(new Date(), new Date(nextEpochStats.epochStart.timestamp));
    return (
        <RelativeContainer>
            <>
                <InfoHeader>
                    <InfoHeaderItem>Next epoch starts in {stakingStartsFormattedTime}</InfoHeaderItem>
                </InfoHeader>
                <Inner>
                    <CenteredHeader>
                        {stake.loadingState === TransactionLoadingState.WaitingForSignature ? (
                            `Please confirm in ${providerState.displayName || 'wallet'}`
                        ) : stake.loadingState === TransactionLoadingState.WaitingForTransaction ? (
                            `Locking your tokens into staking pool`
                        ) : (
                            // Default case
                            <>
                                You're delegating {stakingAmountRounded} ZRX to
                                {selectedStakingPools.length > 1
                                    ? ` ${selectedStakingPools.length} pools`
                                    : ` ${stakingUtils.getPoolDisplayName(selectedStakingPools[0].pool)}`}
                            </>
                        )}
                    </CenteredHeader>
                    <>
                        <DescriptionContainer>
                            <Description>Your tokens will be locked.</Description>
                            <DescriptionLabel>Unlocking will take between 2-4 weeks (1-2 Epochs)</DescriptionLabel>
                        </DescriptionContainer>
                        <DescriptionContainer>
                            <Description>You give 50% of your voting powers.</Description>
                            <DescriptionLabel>
                                Half of your voting power will be given to your staking pools
                            </DescriptionLabel>
                        </DescriptionContainer>
                    </>
                    {/* Determine button to show */}
                    {!stake.loadingState ? (
                        <ButtonWithIcon
                            onClick={async () => {
                                stake.depositAndStake(
                                    selectedStakingPools.map(recommendation => ({
                                        poolId: recommendation.pool.poolId,
                                        zrxAmount: recommendation.zrxAmount,
                                    })),
                                );
                            }}
                            color={colors.white}
                        >
                            I understand, stake my ZRX
                        </ButtonWithIcon>
                    ) : stake.loadingState === TransactionLoadingState.WaitingForSignature ||
                      stake.loadingState === TransactionLoadingState.WaitingForTransaction ? (
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
                                    : getFormattedTimeLeft(timeRemainingForStakingTransaction)}
                            </span>
                        </ButtonWithIcon>
                    ) : stake.loadingState === TransactionLoadingState.Failed ? (
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
                    ) : null}
                </Inner>
            </>
        </RelativeContainer>
    );
};

const RelativeContainer = styled.div`
    position: relative;
`;

const DescriptionText = styled(Paragraph)`
    text-align: center;
    width: 80%;
    margin: 0 auto 30px auto;
`;

const UnlockIconContainer = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-bottom: 60px;
`;

const UnlockHeader = styled(CenteredHeader)`
    height: inherit;
    margin-bottom: 30px;
`;

export interface TokenApprovalPaneProps {
    providerState: ProviderState;
    allowance: UseAllowanceHookResult;
    onGoToNextStep: () => void;
}

export const TokenApprovalPane = (props: TokenApprovalPaneProps) => {
    const { providerState, allowance, onGoToNextStep } = props;

    const timeRemainingForAllowanceApproval = useSecondsRemaining(allowance.estimatedTransactionFinishTime);

    // Simple effect that handles going to the next step when approval is done
    // TODO(johnrjj) -- Hook up lottie animation complete to trigger next step
    React.useLayoutEffect(() => {
        if (allowance.loadingState && allowance.loadingState === TransactionLoadingState.Success) {
            onGoToNextStep();
        }
    }, [allowance.loadingState, onGoToNextStep]);

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
                            : getFormattedTimeLeft(timeRemainingForAllowanceApproval)}
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
    if (!ActiveButon) {
        ActiveButon = (
            <ButtonWithIcon
                onClick={async () => {
                    const allowanceBaseUnits =
                        (providerState.account as AccountReady).zrxAllowanceBaseUnitAmount || new BigNumber(0);

                    if (allowanceBaseUnits.isLessThan(constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS)) {
                        allowance.setAllowance();
                    }
                }}
                color={colors.white}
            >
                Approve tokens
            </ButtonWithIcon>
        );
    }

    return (
        <RelativeContainer>
            <Inner>
                <UnlockIconContainer>
                    <UnlockIcon />
                </UnlockIconContainer>
                <UnlockHeader>Unlock your ZRX</UnlockHeader>
                <DescriptionText isMuted={false} color={colors.textDarkSecondary}>
                    In order to stake you ZRX tokens you must first grant permissions to the 0x Staking Proxy contract.
                    This will allow the contract to transfer the ZRX tokens you decide to stake, and start earning
                    rewards.
                </DescriptionText>
                {ActiveButon}
            </Inner>
        </RelativeContainer>
    );
    // tslint:disable-next-line: max-file-line-count
};
