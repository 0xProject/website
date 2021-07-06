import * as React from 'react';

import * as _ from 'lodash';

import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { MoveStakeData } from 'ts/hooks/use_stake';
import { State } from 'ts/redux/reducer';
import { stakingUtils } from 'ts/utils/staking_utils';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { AddPoolDialog } from 'ts/components/staking/add_pool_dialog';
import { Loading } from 'ts/components/portal/loading';
import { ZRXInput } from 'ts/components/staking/staking_calculator';
import { PercentageSlider } from 'ts/components/slider/percentage_slider';

import { Heading } from 'ts/components/text';
import { Select, SelectItemConfig } from 'ts/components/ui/select';
import { useAPIClient } from 'ts/hooks/use_api_client';

import { colors } from 'ts/style/colors';
import { PoolEpochDelegatorStats, PoolWithStats } from 'ts/types';

const paletteColors = require('nice-color-palettes');
const randPalette = ['#fe4365', '#fc9d9a', '#f9cdad', '#c8c8a9', '#83af9b'];

const ButtonClose = styled(Button)`
    width: 22px;
    height: 22px;
    border: none;
    align-self: flex-end;
    path {
        fill: ${colors.textDarkSecondary};
    }
`;

const AddPoolButton = styled(Button)`
    margin-bottom: 20px;
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

const StakingPoolsContainer = styled.div`
    margin: 1rem 0;
`;

const StakingPoolWrapper = styled.div`
    margin-bottom: 1rem;
`;

const ButtonsContainer = styled.div`
    margin-top: 2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

const StakingPoolLabel = styled.div`
    margin-bottom: 0.5rem;
`;
const HeadingWrapper = styled.div`
    margin: 1rem 0;
    font-weight: 400;
`;

const RewardRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding-bottom: 0.75rem;
    margin-bottom: 0.85rem;
`;

const ColorBox = styled.div`
    width: 20px;
    height: 20px;
    margin-left: 0.5rem;
    position: absolute;
    margin-top: -0.15rem;
    display: inline-block;
`;

const StakingPoolLabelWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const RemovePool = styled.div`
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
    align-self: flex-end;
    margin-bottom: 0.5rem;
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

interface PoolDataElement {
    pool: PoolWithStats;
    zrxStaked: number;
}

interface PoolDiff {
    poolId: string;
    diff: number;
}

interface StakeRebalanceProps {
    onClose: () => void;
    poolData: PoolDataElement[];
    stakingPools: PoolWithStats[];
    rebalanceStake: (rebalanceStakeData: MoveStakeData[]) => void;
}
export const StakeRebalance: React.FC<StakeRebalanceProps> = ({ onClose, poolData, stakingPools, rebalanceStake }) => {
    const networkId = useSelector((state: State) => state.networkId);
    const apiClient = useAPIClient(networkId);

    const originalSumOfZrx = poolData
        .map((item) => item.zrxStaked)
        .reduce((accumulator, currentValue) => accumulator + currentValue);

    const [sliderPercentages, setSliderPercentages] = React.useState<number[]>(
        new Array(poolData.length).fill(100 / poolData.length),
    );
    const [isAddPoolDialogOpen, setIsAddPoolDialogOpen] = React.useState(false);
    const [currentPoolData, setCurrentPoolData] = React.useState<PoolDataElement[]>(poolData);

    const node = React.useRef<HTMLDivElement>();

    // const handleClick = (ev: MouseEvent): any => {
    //     if (node.current.contains(ev.target as Element)) {
    //         return;
    //     }
    //     onClose();
    // };

    // React.useEffect(() => {
    //     document.addEventListener('mousedown', handleClick);

    //     return () => {
    //         document.removeEventListener('mousedown', handleClick);
    //     };
    // }, []);

    const updateSliderPercentages = (widths: number[]) => {
        setSliderPercentages(widths);
        const sumOfZrx = currentPoolData
            .map((item) => item.zrxStaked)
            .reduce((accumulator, currentValue) => accumulator + currentValue);
        const updatedCurrentPoolData = currentPoolData.map((item, index) => {
            return {
                pool: item.pool,
                zrxStaked: parseFloat((sumOfZrx * (widths[index] / 100)).toFixed(2)),
            };
        });
        setCurrentPoolData(updatedCurrentPoolData);
    };

    const addPool = (poolId: string) => {
        const pool = stakingPools.find((pool) => {
            return pool.poolId === poolId;
        });
        const updatedCurrentPoolData = [
            ...currentPoolData,
            {
                pool,
                zrxStaked: 0,
            },
        ];
        const updatedSliderPercentages = new Array(updatedCurrentPoolData.length).fill(
            100 / updatedCurrentPoolData.length,
        );

        const sumOfZrx = updatedCurrentPoolData
            .map((item) => item.zrxStaked)
            .reduce((accumulator, currentValue) => accumulator + currentValue);
        const updatedPoolDataWithStakedAmounts = updatedCurrentPoolData.map((item, index) => {
            return {
                pool: item.pool,
                zrxStaked: parseFloat((sumOfZrx * (updatedSliderPercentages[index] / 100)).toFixed(2)),
            };
        });
        setCurrentPoolData(updatedPoolDataWithStakedAmounts);
        setSliderPercentages(updatedSliderPercentages);
    };

    const filteredStakingPools = stakingPools.filter((pool) => {
        const foundPool = currentPoolData.find((poolDataPool) => {
            return poolDataPool.pool.poolId === pool.poolId;
        });
        return !foundPool;
    });

    const poolTags = currentPoolData.map((pool, index) => {
        return {
            name: pool.pool.poolId,
            color: randPalette[index],
        };
    });

    const onPoolInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updatedStakedZrx = parseFloat(e.target.value || '0');
        let updatedCurrentPoolData = [...currentPoolData];
        if (updatedStakedZrx <= originalSumOfZrx) {
            const remainderZrx = (originalSumOfZrx - updatedStakedZrx) / (updatedCurrentPoolData.length - 1);
            updatedCurrentPoolData = updatedCurrentPoolData.map((item, innerIndex) => {
                if (index !== innerIndex) {
                    return {
                        pool: item.pool,
                        zrxStaked: remainderZrx,
                    };
                }
                return {
                    pool: item.pool,
                    zrxStaked: updatedStakedZrx,
                };
            });
        }

        const sumOfZrx = updatedCurrentPoolData
            .map((item) => item.zrxStaked)
            .reduce((accumulator, currentValue) => accumulator + currentValue);

        const _widths = updatedCurrentPoolData.map((item) => {
            return (item.zrxStaked / sumOfZrx) * 100;
        });

        setCurrentPoolData(updatedCurrentPoolData);
        setSliderPercentages(_widths);
    };

    const removePool = (poolId: string) => {
        const updatedCurrentPoolData = currentPoolData.filter((item) => {
            return item.pool.poolId !== poolId;
        });

        const updatedSliderPercentages = new Array(updatedCurrentPoolData.length).fill(
            100 / updatedCurrentPoolData.length,
        );

        const updatedPoolDataWithStakedAmounts = updatedCurrentPoolData.map((item, index) => {
            return {
                pool: item.pool,
                zrxStaked: parseFloat((originalSumOfZrx * (updatedSliderPercentages[index] / 100)).toFixed(2)),
            };
        });

        setCurrentPoolData(updatedPoolDataWithStakedAmounts);
        setSliderPercentages(updatedSliderPercentages);
    };

    const generateMoveStakeData = (poolDiff: PoolDiff, reductions: PoolDiff[]): MoveStakeData[] | MoveStakeData => {
        const { poolId, diff } = poolDiff;
        let accumulatedAmount = 0;
        const moveStakeData = [];
        for (let index = 0; index < reductions.length; index++) {
            const element = reductions[index];
            const availAmt = Math.abs(element.diff);
            if (availAmt >= diff - accumulatedAmount) {
                moveStakeData.push({
                    fromPoolId: element.poolId,
                    toPoolId: poolId,
                    zrxAmount: parseFloat((diff - accumulatedAmount).toFixed(2)),
                });
            }
            accumulatedAmount += availAmt;
            moveStakeData.push({
                fromPoolId: element.poolId,
                toPoolId: poolId,
                zrxAmount: parseFloat(availAmt.toFixed(2)),
            });
        }
        return moveStakeData;
    };

    const rebalanceStakeAcrossPools = () => {
        const additions: PoolDiff[] = [];
        const reductions: PoolDiff[] = [];

        currentPoolData.forEach((item) => {
            const foundPool = poolData.find((foundItem) => {
                return item.pool.poolId === foundItem.pool.poolId;
            });
            let diff = 0;
            if (foundPool) {
                diff = item.zrxStaked - foundPool.zrxStaked;
            } else {
                diff = item.zrxStaked;
            }

            if (diff !== 0) {
                if (diff > 0) {
                    additions.push({
                        poolId: item.pool.poolId,
                        diff,
                    });
                } else {
                    reductions.push({
                        poolId: item.pool.poolId,
                        diff,
                    });
                }
            }
        });

        console.log(additions, reductions);

        if (additions.length > 0) {
            const data = _.flatMap<PoolDiff, MoveStakeData>(additions, (item) => {
                return generateMoveStakeData(item, reductions);
            });
            rebalanceStake(data);
        }
    };

    return (
        <>
            <Container ref={node}>
                <ButtonClose isTransparent={true} isNoBorder={true} padding="0px" onClick={onClose}>
                    <Icon name="close-modal" />
                </ButtonClose>
                {true && (
                    <>
                        <HeadingWrapper>
                            <Heading fontWeight="400" asElement="h3" marginBottom="0">
                                Change your Stake
                            </Heading>
                        </HeadingWrapper>
                        <StakingPoolsContainer>
                            {currentPoolData.map((data, index) => {
                                const poolTag = poolTags.find((item) => {
                                    return item.name === data.pool.poolId;
                                });

                                const isStartingPool = poolData.find((item) => {
                                    return item.pool.poolId === data.pool.poolId;
                                });

                                return (
                                    <StakingPoolWrapper>
                                        <StakingPoolLabelWrapper>
                                            <StakingPoolLabel>
                                                {stakingUtils.getPoolDisplayName(data.pool)}
                                                <ColorBox style={{ background: poolTag.color }} />
                                            </StakingPoolLabel>
                                            {!isStartingPool && (
                                                <RemovePool
                                                    onClick={() => {
                                                        removePool(data.pool.poolId);
                                                    }}
                                                >
                                                    Remove Pool
                                                </RemovePool>
                                            )}
                                        </StakingPoolLabelWrapper>
                                        <ZRXInput
                                            value={data.zrxStaked.toString()}
                                            onChange={(e) => {
                                                onPoolInputChange(e, index);
                                            }}
                                        />
                                    </StakingPoolWrapper>
                                );
                            })}
                        </StakingPoolsContainer>
                        <PercentageSlider
                            pools={currentPoolData}
                            tags={poolTags}
                            widths={sliderPercentages}
                            setWidths={updateSliderPercentages}
                        />
                        <ButtonsContainer>
                            {currentPoolData.length < 4 && (
                                <AddPoolButton
                                    borderColor="#D5D5D5"
                                    bgColor={colors.white}
                                    fontWeight="300"
                                    isNoBorder={true}
                                    padding="15px 35px"
                                    isFullWidth={true}
                                    onClick={() => {
                                        setIsAddPoolDialogOpen(true);
                                    }}
                                >
                                    + Add Pool
                                </AddPoolButton>
                            )}
                            <Button color={colors.white} isFullWidth={true} onClick={rebalanceStakeAcrossPools}>
                                Confirm New Stake
                            </Button>
                        </ButtonsContainer>
                        <AddPoolDialog
                            stakingPools={filteredStakingPools || []}
                            isOpen={isAddPoolDialogOpen}
                            onDismiss={() => {
                                setIsAddPoolDialogOpen(false);
                            }}
                            onAddPool={addPool}
                        />
                    </>
                )}
            </Container>
        </>
    );
};
