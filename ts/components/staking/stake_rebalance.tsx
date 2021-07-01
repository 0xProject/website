import * as React from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
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
const randPalette = paletteColors
    .sort(function () {
        return 0.5 - Math.random();
    })

    .pop();
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

interface PoolDataElement {
    pool: PoolWithStats;
    zrxStaked: number;
}

interface StakeRebalanceProps {
    onClose: () => void;
    poolData: PoolDataElement[];
    stakingPools: PoolWithStats[];
}
export const StakeRebalance: React.FC<StakeRebalanceProps> = ({ onClose, poolData, stakingPools }) => {
    const networkId = useSelector((state: State) => state.networkId);
    const apiClient = useAPIClient(networkId);

    const [sliderPercentages, setSliderPercentages] = React.useState<number[]>(
        new Array(poolData.length).fill(100 / poolData.length),
    );
    const [isAddPoolDialogOpen, setIsAddPoolDialogOpen] = React.useState(false);
    const [currentPoolData, setCurrentPoolData] = React.useState<PoolDataElement[]>(poolData);

    const node = React.useRef<HTMLDivElement>();

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

    const updateSliderPercentage = (widths: number[]) => {
        setSliderPercentages(widths);
        const sumOfZrx = currentPoolData
            .map((item) => item.zrxStaked)
            .reduce((accumulator, currentValue) => accumulator + currentValue);
        const updatedCurrentPoolData = currentPoolData.map((item) => {
            return {
                pool: item.pool,
                zrxStaked: item.zrxStaked,
            };
        });
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
        setCurrentPoolData(updatedCurrentPoolData);
        setSliderPercentages(new Array(updatedCurrentPoolData.length).fill(100 / updatedCurrentPoolData.length));
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
                            {currentPoolData.map((data) => {
                                return (
                                    <StakingPoolWrapper>
                                        <StakingPoolLabel>
                                            {stakingUtils.getPoolDisplayName(data.pool)}
                                        </StakingPoolLabel>
                                        <ZRXInput value={data.zrxStaked.toString()} />
                                    </StakingPoolWrapper>
                                );
                            })}
                        </StakingPoolsContainer>
                        <PercentageSlider
                            pools={currentPoolData}
                            tags={poolTags}
                            widths={sliderPercentages}
                            setWidths={setSliderPercentages}
                        />
                        <ButtonsContainer>
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
                            <Button color={colors.white} isFullWidth={true}>
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
