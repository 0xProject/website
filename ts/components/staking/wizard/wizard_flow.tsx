import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { addMilliseconds, differenceInSeconds, formatDistanceStrict } from 'date-fns';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';
import {
    AccountReady,
    AccountState,
    Network,
    PoolWithStats,
    ProviderState,
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
import { useAllowance } from 'ts/hooks/use_allowance';
import { useStake } from 'ts/hooks/use_stake';
import { stakingUtils } from 'ts/utils/staking_utils';

import { TransactionItem } from 'ts/components/staking/wizard/transaction_item';

import { ApproveTokensInfoDialog } from 'ts/components/dialogs/approve_tokens_info_dialog';

export interface WizardFlowProps {
    providerState: ProviderState;
    onOpenConnectWalletDialog: () => void;
    networkId: Network;
    setSelectedStakingPools: React.Dispatch<React.SetStateAction<UserStakingChoice[]>>;
    selectedStakingPools: UserStakingChoice[] | undefined;
    stakingPools?: PoolWithStats[];
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
`;

// TODO(jj) consolidate with remove page
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

// todo(jj) refactor this to imitate the remove flow
export const WizardFlow: React.FC<WizardFlowProps> = ({
    setSelectedStakingPools,
    selectedStakingPools,
    stakingPools,
    ...props
}) => {
    /* <MarketMaker
            name="Binance staking pool"
            collectedFees="3.212,032 ETH"
            rewards="95%"
            staked="52%"
            difference="+500,000 ZRX"
            iconUrl="/images/toshi_logo.jpg"
        />
        <InfoHeader>
            <InfoHeaderItem>
                Recommended market makers <NumberRound>2</NumberRound>
            </InfoHeaderItem>
            <InfoHeaderItem>
                <Button isWithArrow={true} color={colors.textDarkSecondary}>
                    Full list
                </Button>
            </InfoHeaderItem>
        </InfoHeader>

        <InfoHeader>
            <InfoHeaderItem>Start Staking</InfoHeaderItem>
            <InfoHeaderItem>Begins in 2 days</InfoHeaderItem>
        </InfoHeader>

        <Inner>
            <TransactionItem
                marketMakerId="0x12345...12345"
                selfId="0x12345...12345"
                sendAmount="1520 ZRX"
                selfIconUrl="/images/toshi_logo.jpg"
                receiveAmount="1520 ZRX"
                marketMakerName="Binance"
                marketMakerIconUrl="/images/toshi_logo.jpg"
                isActive={true}
            />
            <TransactionItem
                marketMakerId="0x12345...12345"
                selfId="0x12345...12345"
                sendAmount="1520 ZRX"
                selfIconUrl="/images/toshi_logo.jpg"
                receiveAmount="1520 ZRX"
                marketMakerName="Binance"
                marketMakerIconUrl="/images/toshi_logo.jpg"
                isActive={false}
            />
            <ButtonWithIcon
                isTransparent={true}
                borderColor="#DFE7E1"
                color={colors.textDarkSecondary}
                isDisabled={true}
            >
                <SpinnerContainer>
                    <Spinner color="#BEBEBE" />
                </SpinnerContainer>
                <span>Waiting for signature</span>
            </ButtonWithIcon>

            <ErrorButton
                message="Transaction aborted"
                secondaryButtonText="Retry"
                onClose={() => {
                    alert('close');
                }}
                onSecondaryClick={() => {
                    alert('close');
                }}
            />
        </Inner>
        <Newsletter /> */
    const [stakeAmount, setStakeAmount] = React.useState<string>('');
    const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const stake = useStake();
    const allowance = useAllowance();
    const [estimatedTransactionFinishTime, setEstimatedTransactionFinishTime] = React.useState<Date | undefined>(
        undefined,
    );

    React.useEffect(() => {
        if (!stake.estimatedTimeMs) {
            return setEstimatedTransactionFinishTime(undefined);
        }
        const estimate = addMilliseconds(new Date(), stake.estimatedTimeMs);
        setEstimatedTransactionFinishTime(estimate);
    }, [stake.estimatedTimeMs]);

    // TODO(jj) need an interval hook here for updating the seconds
    let secondsLeftUntilStakingTransactionDone: number | undefined;
    let timeLeftValue: string | undefined;
    if (estimatedTransactionFinishTime) {
        secondsLeftUntilStakingTransactionDone = Math.max(
            0,
            differenceInSeconds(estimatedTransactionFinishTime, new Date()),
        );
        timeLeftValue = formatDistanceStrict(estimatedTransactionFinishTime, new Date(), { unit: 'second' });
    }

    if (props.providerState.account.state !== AccountState.Ready) {
        return (
            <>
                <ConnectWalletButton color={colors.white} onClick={props.onOpenConnectWalletDialog}>
                    Connect your wallet to start staking
                </ConnectWalletButton>
                <Status
                    title="Please connect your wallet, so we can find suitable market maker."
                    linkText="or explore market maker list"
                    to={WebsitePaths.Staking}
                />
            </>
        );
    }
    const { zrxBalanceBaseUnitAmount, address } = props.providerState.account;
    if (!zrxBalanceBaseUnitAmount) {
        // Fetching balance
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

    const formattedAmount = utils.getFormattedAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
    const statusNode = getStatus(stakeAmount, stakingPools);
    const recommendedPools = stakingUtils.getRecommendedStakingPools(Number(stakeAmount), stakingPools);

    // Confirmation page stage, ready to stake (may need to approve first)
    if (selectedStakingPools) {
        return (
            <>
                {/* TODO find the correct header component */}
                <ApproveTokensInfoDialog
                    isOpen={isModalOpen}
                    onDismiss={() => setIsModalOpen(false)}
                    providerName={props.providerState.displayName}
                />

                {/* <InfoHeader>
                <InfoHeaderItem>
                    Remove Stake
                </InfoHeaderItem>

                {data != null && data.amountStaked != null && (
                    <InfoHeaderItem>
                        Total Staked: {utils.getFormattedAmount(data.amountStaked, 0)}
                    </InfoHeaderItem>
                )}
            </InfoHeader> */}

                <Inner>
                    <CenteredHeader>
                        {stake.loadingState === TransactionLoadingState.WaitingForSignature
                            ? `Please confirm in ${props.providerState.displayName || 'wallet'}`
                            : stake.loadingState === TransactionLoadingState.WaitingForTransaction
                            ? `Locking your tokens into staking pool`
                            : // Default case
                              `You're delegating ${stakeAmount} ZRX to ${
                                  selectedStakingPools.length > 1
                                      ? `${selectedStakingPools.length} pools`
                                      : `${selectedStakingPools[0].pool.metaData.name || '1 pool'}`
                              }`}
                    </CenteredHeader>
                    {selectedStakingPools.map(stakingPool => {
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
                    {/* Waiting for a signature... */}
                    {stake.loadingState === TransactionLoadingState.WaitingForSignature ||
                    stake.loadingState === TransactionLoadingState.WaitingForTransaction ? (
                        <ButtonWithIcon
                            isTransparent={true}
                            borderColor="#DFE7E1"
                            color={colors.textDarkSecondary}
                            isDisabled={true}
                        >
                            <SpinnerContainer>
                                <Spinner color="#BEBEBE" />
                            </SpinnerContainer>
                            <span>
                                {stake.loadingState === TransactionLoadingState.WaitingForSignature
                                    ? 'Waiting for signature'
                                    : `${timeLeftValue} left`}
                            </span>
                        </ButtonWithIcon>
                    ) : (
                        <ButtonWithIcon
                            onClick={async () => {
                                const allowanceBaseUnits =
                                    (props.providerState.account as AccountReady).zrxAllowanceBaseUnitAmount ||
                                    new BigNumber(0);

                                if (allowanceBaseUnits.isLessThan(constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS)) {
                                    setIsModalOpen(true);
                                    allowance.setAllowance();
                                } else {
                                    stake.depositAndStake(selectedStakingPools);
                                }
                            }}
                            color={colors.white}
                        >
                            Start staking
                        </ButtonWithIcon>
                    )}
                </Inner>
            </>
        );
    }

    return (
        <>
            <NumberInput
                placeholder="Enter your stake"
                heading="Amount"
                topLabels={['Amount', `Available: ${formattedAmount} ZRX`]}
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
                                name={
                                    rec.pool.metaData.name ||
                                    utils.getAddressBeginAndEnd(_.head(rec.pool.nextEpochStats.makerAddresses))
                                }
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
                    Start staking
                </ButtonWithIcon>
            )}
        </>
    );
    // tslint:disable-next-line: max-file-line-count
};
