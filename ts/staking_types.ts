import { BigNumber } from '@0x/utils';

export interface StakingTimeMetadata {
    observedTimestamp: number;
    txHash?: string;
    blockNumber: number;
}

export interface ApproximateEpochTime {
    approximateTimestamp: number;
    blockNumber: number;
}

export interface EpochStats {
    epoch_id: number;
    startingEpochTime: StakingTimeMetadata;
    endingEpochTime?: StakingTimeMetadata;
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
    stakeStatus: ZrxStakerBalance;
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

export interface ZrxStakerBalance {
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

export interface StakingContractParams {
    epochDurationInSeconds: number;
    rewardDelegatedStakeWeight: number;
    minimumPoolStake: number;
    maximumMakersInPool: number;
    cobbDouglasAlphaNumerator: number;
    cobbDouglasAlphaDenominator: number;
    wethProxyAddress: string;
    zrxVaultAddress: string;
}

enum StakingEventType {
    StakingContract = 'STAKING',
    StakingStaker = 'STAKING_STAKER',
    StakingPool = 'STAKING_POOL',
    StakingDelegator = 'STAKING_DELEGATOR',
}

enum StakingStakeStatus {
    Withdrawable = 'WITHDRAWABLE',
    Inactive = 'INACTIVE',
    Active = 'ACTIVE',
    Delegated = 'DELEGATED',
}

export type StakingDelegatorRelevantEvents = StakingStakerRelevantEvents | StakingDelegatorEvent;
export type StakingStakerRelevantEvents = StakingStakerEvent | StakingPoolRelevantEvents;
export type StakingPoolRelevantEvents = StakingContractEvent | StakingRelevantEvents;
export type StakingRelevantEvents =  StakingPoolEvent;

export interface StakingEventBase {
    timeStamp: StakingTimeMetadata;
}

export interface StakingContractEvent extends StakingEventBase {
    eventType: StakingEventType.StakingContract;
}

export interface StakingContractEpochEndedEvent extends StakingContractEvent {
    event: 'STAKING_EPOCH_ENDED';
    epochId: number;
    numActivePools: number;
    rewardsAvailableInEth: BigNumber;
    totalFeesGeneratedInEth: BigNumber;
    totalZrxStaked: BigNumber;
}

export interface StakingContractEpochFinalizedEvent extends StakingContractEvent {
    event: 'STAKING_EPOCH_FINALIZED';
    epoch: number;
    rewardsPaidInEth: BigNumber;
    rewardsRemainingInEth: BigNumber;
}

export interface StakingContractParamsChangeEvent extends StakingContractEvent {
    event: 'PARAMS_CHANGE';
    fromParams: StakingContractParams;
    toParams: StakingContractParams;
}

export interface StakingContractExchangeAddedEvent extends StakingContractEvent {
    event: 'EXCHANGE_ADDED';
    exchangeAddress: string;
}

export interface StakingContractExchangeRemovedEvent extends StakingContractEvent {
    event: 'EXCHANGE_REMOVED';
    exchangeAddress: string;
}

export interface StakingStakerEvent extends StakingEventBase {
    eventType: StakingEventType.StakingStaker;
    stakerAddress: string;
}

export interface StakingStakerStatusChangeEvent extends StakingStakerEvent {
    event: 'STAKE_CHANGED_STATUS';
    zrxAmountStakedChanged: BigNumber;
    fromPoolId?: string;
    toPoolId?: string;
    toStatus: StakingStakeStatus;
    fromStatus: StakingStakeStatus;
}

export interface StakingPoolEvent extends StakingEventBase {
    eventType: StakingEventType.StakingPool;
}

export interface StakingPoolActivatedEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_ACTIVATED';
    epochId: number;
    poolId: number;
}

export interface StakingPoolCreatedEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_CREATED';
    operatorAddress: string;
    delegatorStakingPoolOwnershipShare: number;
}

export interface StakingPoolMetadataUpdatedEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_METADATA_UPDATED';
    oldMetadata: StakingPoolMetadata;
    newMetadata: StakingPoolMetadata;
}

export interface StakingPoolVerifiedUpdatedEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_VERIFIED_UPDATED';
    oldVerified: boolean;
    newVerified: boolean;
}

export interface StakingPoolStatusUpdatedEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_STATUS_UPDATED';
    oldStatus: StakingPoolStatus;
    newStatus: StakingPoolStatus;
}

export interface StakingPoolPendingAddMakerEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_PENDING_ADD_MAKER';
    makerAddress: string;
}

export interface StakingPoolAddedMakerEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_ADDED_MAKER';
    makerAddress: string;
}

export interface StakingPoolRemovedMakerEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_REMOVED_MAKER';
    makerAddress: string;
}

export interface StakingPoolOperatorShareDecreasedEvent extends StakingPoolEvent {
    event: 'STAKING_POOL_OPERATATOR_SHARE_DECREASED';
    oldOperatorShare: number;
    newOperatorShare: number;
}

export interface StakingPoolEpochEndedEvent extends StakingPoolEvent {
    event: 'STAKING_EPOCH_ENDED';
    epoch: number;
    rewardsAvailableForDelegatorPoolInEth: BigNumber;
    rewardsAvailableForOperatorInEth: BigNumber;
    totalFeesGeneratedInEth: BigNumber;
    totalZrxStaked: BigNumber;
}

export interface StakingDelegatorEvent extends StakingEventBase {
    eventType: StakingEventType.StakingDelegator;
    delegatorAddress: string;
}


export interface StakingDelegatorEpochEndedEvent extends StakingDelegatorEvent {
    event: 'STAKING_EPOCH_ENDED';
    epoch: number;
    poolId: number;
    rewardsAvailableForDelegatorPoolInEth: BigNumber;
    rewardsAvailableForDelegatorInEth: BigNumber;
}

export interface StakingDelegatorRewardsPaidEvent extends StakingDelegatorEvent {
    event: 'STAKING_DELEGATOR_REWARDS_PAID';
    epoch: number;
    withdrawableTotalFeesSharedInEth: BigNumber;
    totalFeesSharedInEth: BigNumber;
}
