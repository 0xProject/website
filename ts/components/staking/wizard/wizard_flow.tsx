import { logUtils } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as _ from 'lodash';
import * as React from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';
import { AccountState, Network, PoolWithStats, ProviderState, WebsitePaths } from 'ts/types';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

import { Button } from 'ts/components/button';
import { MarketMaker } from 'ts/components/staking/wizard/market_maker';
import { NumberInput } from 'ts/components/staking/wizard/number_input';
import { Status } from 'ts/components/staking/wizard/status';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { Inner } from 'ts/components/staking/wizard/inner';
import { TransactionItem } from 'ts/components/staking/wizard/transaction_item';
import { Spinner } from 'ts/components/ui/spinner';

export interface WizardFlowProps {
    providerState: ProviderState;
    onOpenConnectWalletDialog: () => void;
    networkId: Network;
    setSelectedStakingPools: React.Dispatch<React.SetStateAction<PoolWithStats[]>>;
    selectedStakingPools: PoolWithStats[] | undefined;
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
    border: 1px solid #F6F6F6;
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

export const WizardFlow: React.FC<WizardFlowProps> = ({ setSelectedStakingPools, selectedStakingPools, ...props }) => {
    if (selectedStakingPools) {
        return (
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
    
        </Inner>
        )
    }

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
    // Found staking pools, not necessarily 'selected'
    const [stakingPools, setStakingPools] = React.useState<PoolWithStats[] | undefined>(undefined);
    const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(undefined);
    const apiClient = useAPIClient();
    useDebounce(() => {
        const fetchAndSetPools = async () => {
            let pools: PoolWithStats[] = [];
            try {
                const poolsResponse = await apiClient.getStakingPoolsAsync();
                // TODO: Pick pool more intelligently
                pools = [_.head(poolsResponse.stakingPools)];
            } catch (err) {
                logUtils.warn(err);
            } finally {
                setStakingPools(pools);
            }
        };
        setStakingPools(undefined);
        if (stakeAmount) {
            // tslint:disable-next-line:no-floating-promises
            fetchAndSetPools();
        }
    }, 200, [stakeAmount]);
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
    const { zrxBalanceBaseUnitAmount } = props.providerState.account;
    if (!zrxBalanceBaseUnitAmount) {
        // Fetching balance
        return (
            <Status title=""/>
        );
    }
    if (!zrxBalanceBaseUnitAmount.gt(0)) {
        return (
            <Status
                title="You have no ZRX balance. You will need some to stake."
                linkText="Go buy some ZRX"
                linkUrl={`https://www.rexrelay.com/instant/?defaultSelectedAssetData=${constants.ZRX_ASSET_DATA}`}
            />
        );
    }
    const formattedAmount = utils.getFormattedAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
    const unitAmount = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX).toNumber();
    const statusNode = getStatus(stakeAmount, stakingPools);
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
            {stakingPools && stakingPools.length > 0 && (
                    <InfoHeader>
                    <InfoHeaderItem>
                        Recommended staking pools {stakingPools.length > 1 && <NumberRound>{stakingPools.length}</NumberRound>}
                    </InfoHeaderItem>
                    <InfoHeaderItem>
                        <Button isWithArrow={true} color={colors.textDarkSecondary} to={WebsitePaths.Staking}>
                            Full list
                        </Button>
                    </InfoHeaderItem>
                    </InfoHeader>
            )}
            {stakingPools && stakingPools.map(pool => {
                return (
                    <MarketMaker
                        key={pool.poolId}
                        name={pool.metaData.name || utils.getAddressBeginAndEnd(_.head(pool.nextEpochStats.makerAddresses))}
                        collectedFees={pool.currentEpochStats.protocolFeesGeneratedInEth}
                        rewards={1 - pool.nextEpochStats.approximateStakeRatio}
                        staked={pool.nextEpochStats.approximateStakeRatio}
                        iconUrl={pool.metaData.logoUrl}
                        website={pool.metaData.websiteUrl}
                        // TODO: implement difference correctly
                        difference={formattedAmount}
                    />
                );
            })}
            {statusNode}
            {stakingPools && stakingPools.length > 0 &&
                <ButtonWithIcon onClick={() => setSelectedStakingPools(stakingPools)}
                    color={colors.white}
                >
                    Start staking
                </ButtonWithIcon>
            }
        </>
    );
};
