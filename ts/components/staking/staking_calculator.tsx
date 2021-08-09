import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as React from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { State } from 'ts/redux/reducer';
import { stakingUtils } from 'ts/utils/staking_utils';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Loading } from 'ts/components/portal/loading';

import { Heading } from 'ts/components/text';
import { Select, SelectItemConfig } from 'ts/components/ui/select';
import { useAPIClient } from 'ts/hooks/use_api_client';

import { colors } from 'ts/style/colors';

import { AccountReady, PoolWithStats } from 'ts/types';
import { constants } from 'ts/utils/constants';
import { formatZrx } from 'ts/utils/format_number';

const ButtonClose = styled(Button)`
    width: 22px;
    height: 22px;
    border: none;
    align-self: flex-end;
    path {
        fill: ${colors.textDarkSecondary};
    }
`;
const Container = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    background-color: #f6f6f6;
    width: 500px;
    padding: 2rem;
    height: 100%;
    z-index: 2;
    box-shadow: 10px 0px 20px #000000;
    display: flex;
    flex-direction: column;
`;

const StakingPoolContainer = styled.div`
    margin: 1rem 0;
`;
const LoadingContainer = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
`;

const StakingPoolLabel = styled.div`
    margin-bottom: 0.5rem;
`;
const HeadingWrapper = styled.div`
    margin: 1rem 0;
    font-weight: 400;
`;
const YourStakeContainer = styled.div`
    padding: 1rem 0;
`;
const YourStakeLabels = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
`;
const YourStakeTitle = styled.div``;
const YourStakeBalance = styled.div`
    color: #999999;
    font-size: 14px;
    display: flex;
    align-items: flex-end;
    cursor: pointer;
`;

const RewardRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding-bottom: 0.75rem;
    margin-bottom: 0.85rem;
`;
const Results = styled.div`
    flex: 1;
    justify-content: flex-end;
    display: flex;
    flex-direction: column;
`;
const ResultsLabel = styled.div`
    padding-bottom: 0.75rem;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #d7d7d7;
`;

const PoolReward = styled(RewardRow)`
    color: #999999;

    border-bottom: 1px solid #d7d7d7;
`;
const StakersReward = styled(RewardRow)`
    color: #999999;

    border-bottom: 1px solid #d7d7d7;
`;
const YourReward = styled(RewardRow)`
    padding-bottom: 0.75rem;
    margin-bottom: 0;
`;
const YearlyReturn = styled(RewardRow)`
    padding-bottom: 0.75rem;
    margin-bottom: 0;
`;

const PoolRewardResults = styled.div``;
const StakersRewardResults = styled.div``;
const YourRewardResults = styled.div`
    font-weight: bolder;
`;
const YearlyReturnResults = styled.div``;

const ZRXInputField = styled.div`
    display: flex;
    justify-content: space-between;
    position: relative;
`;
const ZRXLabel = styled.label`
    position: absolute;
    right: 0;
    align-self: center;
    margin-right: 20px;
`;

export const ZRXInput: React.FC<InputProps> = ({ value, className, placeholder, onChange }) => (
    <ZRXInputField>
        <Input className={className} value={value} onChange={onChange} placeholder={placeholder} />
        <ZRXLabel>ZRX</ZRXLabel>
    </ZRXInputField>
);
const Input = styled.input`
    background-color: ${colors.white};
    color: ${colors.textDarkPrimary};
    border: 1px solid #d7d7d7;
    width: 100%;
    font-size: 18px;
    padding: 16px 20px 18px;
    outline: none;
    &::placeholder {
        color: #333333;
        opacity: 0.5;
    }
`;

export interface InputProps {
    className?: string;
    value?: string;
    width?: string;
    fontSize?: string;
    fontColor?: string;
    padding?: string;
    placeholderColor?: string;
    placeholder?: string;
    backgroundColor?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface StakingCalculatorProps {
    defaultPoolId: string;
    onClose: () => void;
}
export const StakingCalculator: React.FC<StakingCalculatorProps> = ({ defaultPoolId, onClose }) => {
    const networkId = useSelector((state: State) => state.networkId);
    const apiClient = useAPIClient(networkId);
    const [stakingPools, setStakingPools] = React.useState<PoolWithStats[] | undefined>(undefined);
    const [selectedStakingPool, setSelectedStakingPool] = React.useState<string | undefined>(defaultPoolId);
    const [zrxInput, setZrxInput] = React.useState(0);

    const node = React.useRef<HTMLDivElement>();

    const onStakingPoolSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStakingPool(event.target.value);
    };

    const onZRXInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setZrxInput(parseFloat(event.target.value || '0'));
    };

    const handleClick = (ev: MouseEvent): any => {
        if (node.current.contains(ev.target as Element)) {
            return;
        }
        onClose();
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    const [userZRXBalance, setZRXBalance] = React.useState<number>();

    const providerState = useSelector((state: State) => state.providerState);
    React.useEffect(() => {
        if (providerState) {
            const { zrxBalanceBaseUnitAmount } = providerState.account as AccountReady;
            let zrxBalance: BigNumber | undefined;
            if (zrxBalanceBaseUnitAmount) {
                zrxBalance = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
            }

            if (zrxBalance) {
                const roundedZrxBalance = formatZrx(zrxBalance).roundedValue;
                setZRXBalance(roundedZrxBalance);
            }
        }
    }, [providerState]);

    React.useEffect(() => {
        const fetchAndSetPoolsAsync = async () => {
            const poolsResponse = await apiClient.getStakingPoolsAsync();
            const activePools = (poolsResponse.stakingPools || []).filter(stakingUtils.isPoolActive);
            setStakingPools(activePools);
        };
        // tslint:disable-next-line:no-floating-promises
        fetchAndSetPoolsAsync();
    }, [apiClient]);

    let poolsSelectData: SelectItemConfig[] = [];
    if (stakingPools) {
        poolsSelectData = stakingPools.map((pool) => {
            const label = pool.metaData.name ? pool.metaData.name : `Pool ${pool.poolId}`;
            return {
                label,
                value: pool.poolId,
            };
        });
    }

    let poolReward;
    let stakersReward;
    let yourReward;
    let yearlyReturn;
    let rewardsShared;
    const formatRewards = (num: number) => {
        if (num === 0) {
            return 0;
        }
        if (num > 1) {
            return num.toFixed(2);
        }
        if (num < 0.0001) {
            return num.toExponential(2);
        }

        return num.toFixed(4);
    };

    if (stakingPools && selectedStakingPool) {
        const selectedPool = stakingPools.find((pool) => pool.poolId === selectedStakingPool);
        rewardsShared = (1 - selectedPool.nextEpochStats.operatorShare) * 100;
        poolReward = selectedPool.avgTotalRewardInEth.toFixed(2);
        stakersReward = selectedPool.avgMemberRewardInEth.toFixed(2);
        yourReward = selectedPool.avgMemberRewardEthPerZrx * zrxInput;
        yearlyReturn = yourReward * 52;
        yourReward = formatRewards(yourReward);
        yearlyReturn = formatRewards(yearlyReturn);
    }

    return (
        <>
            <Container ref={node}>
                <ButtonClose isTransparent={true} isNoBorder={true} padding="0px" onClick={onClose}>
                    <Icon name="close-modal" />
                </ButtonClose>
                {!stakingPools && (
                    <LoadingContainer>
                        <Loading isLoading={true} content={null} />
                    </LoadingContainer>
                )}
                {stakingPools && selectedStakingPool && (
                    <>
                        <HeadingWrapper>
                            <Heading fontWeight="400" asElement="h3" marginBottom="0">
                                Reward Simulator
                            </Heading>
                        </HeadingWrapper>

                        <StakingPoolContainer>
                            <StakingPoolLabel>Staking Pool</StakingPoolLabel>
                            <Select
                                onChange={onStakingPoolSelectChange}
                                id={''}
                                value={selectedStakingPool}
                                items={poolsSelectData}
                                shouldIncludeEmpty={false}
                            />
                        </StakingPoolContainer>
                        <YourStakeContainer>
                            <YourStakeLabels>
                                <YourStakeTitle>Your Stake</YourStakeTitle>
                                <YourStakeBalance
                                    onClick={() => {
                                        if (userZRXBalance) {
                                            setZrxInput(userZRXBalance);
                                        }
                                    }}
                                >
                                    Balance: {userZRXBalance || '--'} ZRX
                                </YourStakeBalance>
                            </YourStakeLabels>
                            <ZRXInput value={zrxInput.toString()} onChange={onZRXInputChange} />
                        </YourStakeContainer>
                        <Results>
                            <ResultsLabel>Estimated Weekly Rewards</ResultsLabel>
                            <PoolReward>
                                Average Pool Reward <PoolRewardResults>{poolReward} ETH</PoolRewardResults>
                            </PoolReward>
                            <StakersReward>
                                Staker's Reward ({Math.round(rewardsShared)}%)
                                <StakersRewardResults>{stakersReward} ETH</StakersRewardResults>
                            </StakersReward>
                            <YourReward>
                                Weekly Return <YourRewardResults>{yourReward} ETH</YourRewardResults>
                            </YourReward>
                            <YearlyReturn>
                                Yearly Return <YearlyReturnResults>{yearlyReturn} ETH</YearlyReturnResults>
                            </YearlyReturn>
                        </Results>
                    </>
                )}
            </Container>
        </>
    );
};
