import { BigNumber } from '@0x/utils';

export interface EpochTime {
    observedTimestamp: number;
    txHash: string;
    blockNumber: number;
}

export interface ApproximateEpochTime {
    approximateTimestamp: number;
    blockNumber: number;
}

export interface EpochStats {
    epoch_id: number;
    startingEpochTime: EpochTime;
    endingEpochTime?: EpochTime;
}

export interface EpochStakingStats extends EpochStats {
    totalFeesGeneratedInEth: BigNumber;
    totalFeesSharedToZrxDelegatorsInEth: BigNumber;
    totalTakerFills: TotalTakerFills;
    totalZrxStaked: BigNumber;
}

export interface EpochStakingStakingPoolDelegatorStats {
    delegatorAddress: string;
    stakingPoolOwnershipShare: BigNumber;
    totalFeesSharedInEth: BigNumber;
    totalZrxStaked: BigNumber;
}

export interface EpochStakingPoolStats extends EpochStakingStats {
    totalFeesSharedToZrxDelegatorsInEth: BigNumber;
    operatorOwnershipShare: BigNumber;
    delegators: EpochStakingStakingPoolDelegatorStats[];
}

export interface EpochStakingDelegatorPoolStats {
    poolId: number;
    stakingPoolOwnershipShare: BigNumber;
    totalFeesSharedInEth: BigNumber;
    totalZrxStaked: BigNumber;
}

export interface StakingDelegatorStats {
    delegatorAddress: string;
    currentEpoch: EpochStakingDelegatorStats;
    historical: HistoricalStakingDelegatorStats;
}

export interface EpochStakingDelegatorStats extends EpochStats {
    totalZrxStaked: BigNumber;
    stakeStatus: ZrxStakingStatus;
    totalFeesSharedInEth: BigNumber;
    stakedPools: EpochStakingDelegatorPoolStats[];
}

export interface HistoricalStakingStats {
    totalFeesGeneratedInEth: BigNumber;
    totalFeesSharedToZrxDelegatorsInEth: BigNumber;
    totalTakerFills: TotalTakerFills;
}

export interface HistoricalStakingDelegatorStats {
    totalFeesSharedInEth: number;
}

export interface TakerFills {
    makerAssetData: string;
    takerAssetData: string;
    fillsInTakerUnit: BigNumber;
    fillsInUsd: BigNumber;
    fillsInEth: BigNumber;
}

export interface TotalTakerFills {
    totalInUsd: BigNumber;
    totalInEth: BigNumber;
    totalPerTradingPairs: TakerFills[];
}

export interface StakingStats {
    stakingContractProxyAddress: string;
    currentEpoch: EpochStakingStats;
    historical: HistoricalStakingStats;
}

export enum StakingPoolStatus {
    Active = 'ACTIVE', Inactive = 'INACTIVE',
}

export interface NextEpochStakingPoolStats {
    approximateStakeRatio: number;
    startingEpoch: ApproximateEpochTime;
}

export interface StakingPoolMetadata {
    logoUrl?: string;
    location?: string;
    bio?: string;
    websiteUrl?: string;
    name?: string;
}

export interface ZrxStakingStatus {
    inactive: BigNumber;
    active: BigNumber;
    delegated: BigNumber;
    withdrawable: BigNumber;
}

export interface StakingPoolStats {
    poolId: number;
    operatorAddress: string;
    makerAddresses: string[];
    verified: boolean;
    status: StakingPoolStatus;
    metadata: StakingPoolMetadata;
    nextEpoch: NextEpochStakingPoolStats;
    currentEpoch: EpochStakingPoolStats;
    historical: HistoricalStakingStats;
}

export interface DetailedStakingPoolStats extends StakingPoolStats {
    allEpochs: EpochStakingPoolStats[];
    relevantTradingPairMetadata: TradingPairMetadata[];
}

export interface AssetMetadata {
    assetData: string;
    themeColorInHex: string;
    logoUrl: string;
    ticker: string;
}

export interface TradingPairMetadata {
    makerAsset: AssetMetadata;
    takerAsset: AssetMetadata;
}

// TODO(dave4506) Add activity types
enum StakingEventType {
    StakingContract = 'STAKING',
    StakingStaker = 'STAKING_STAKER',
    StakingPool = 'STAKING_POOL',
    StakingDelegator = 'STAKING_DELEGATOR',
}

export type StakingDelegatorRelevantEvents = StakingPoolRelevantEvents | StakingStakerEvent | StakingDelegatorEvent;
export type StakingPoolRelevantEvents = StakingContractEvent | StakingRelevantEvents;
export type StakingRelevantEvents =  StakingPoolEvent;

export interface StakingContractEvent {
    eventType: StakingEventType.StakingContract;
}

export interface StakingStakerEvent {
    eventType: StakingEventType.StakingStaker;
}

export interface StakingPoolEvent {
    eventType: StakingEventType.StakingPool;
}

export interface StakingDelegatorEvent {
    eventType: StakingEventType.StakingDelegator;
}
