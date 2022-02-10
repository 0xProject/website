import { BigNumber } from '@0x/utils';
import * as moment from 'moment-timezone';

import { TallyInterface } from 'ts/types';

export interface ProposalLink {
    text: string;
    url: string;
}

export interface ProposalProperty {
    title: string;
    summary: string[];
    rating: number;
    links: ProposalLink[];
}

export interface Proposal {
    zeipId: number;
    title: string;
    summary: string[];
    url: string;
    voteStartDate: moment.Moment;
    voteEndDate: moment.Moment;
    benefit: ProposalProperty;
    risks: ProposalProperty;
}

export interface TreasuryProposal {
    id: number;
    timestamp: moment.Moment;
    description: string;
    canceled: boolean;
    executed: boolean;
    forVotes: BigNumber;
    againstVotes: BigNumber;
    upcoming: boolean;
    happening: boolean;
    startDate: moment.Moment;
    endDate: moment.Moment;
    proposer?: string;
    createdTimestamp?: moment.Moment;
    executionEpochStartDate: moment.Moment;
    executionEpochEndDate: moment.Moment;
    executionTimestamp: moment.Moment;
    tally?: TallyInterface;
}

export interface Proposals {
    [id: number]: Proposal;
}

export const proposals: Proposals = {
    23: {
        zeipId: 23,
        title: 'Trade Bundles of Assets',
        summary: [
            `This ZEIP introduces the MultiAssetProxy, which adds support for trading arbitrary bundles of assets to 0x protocol. Historically, only a single asset could be traded per each side of a trade. With the introduction of the MultiAssetProxy, users will be able to trade multiple ERC721 assets or even mix ERC721 and ERC20 assets within a single order.`,
        ],
        url: 'https://blog.0xproject.com/zeip-23-trade-bundles-of-assets-fe69eb3ed960',
        voteStartDate: moment(1551042800, 'X'),
        voteEndDate: moment(1551142800, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `Supporting trades for bundles of assets has been one of the most commonly requested features since the launch of 0x v2. The idea for this feature originated from discussions with gaming and NFT related projects. However, this upgrade also provides utility to relayers for prediction markets or baskets of tokens. The MultiAssetProxy will enable brand new ways of trading.`,
            ],
            rating: 3,
            links: [
                {
                    text: 'Technical detail',
                    url: 'https://github.com/0xProject/ZEIPs/issues/23',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `While the MultiAssetProxy’s code is relatively straightforward and has successfully undergone a full third-party audit, a bug within the code could result in the loss of user funds. Deploying the MultiAssetProxy is a hot upgrade that requires modifying the state of existing contracts within 0x protocol. The contracts being modified contain allowances to many users’ tokens. We encourage the community to verify the code, as well as the state changes.`,
            ],
            rating: 2,
            links: [
                {
                    text: 'View Code',
                    url:
                        'https://github.com/0xProject/0x-monorepo/blob/development/contracts/asset-proxy/contracts/src/MultiAssetProxy.sol#L25',
                },
                {
                    text: 'View Audit',
                    url: 'https://github.com/ConsenSys/0x-audit-report-2018-12',
                },
            ],
        },
    },
    39: {
        zeipId: 39,
        title: 'StaticCallAssetProxy',
        summary: [
            `This ZEIP introduces the ability to create conditional orders based off of arbitrary blockchain state. This can be used to validate stateful assets during settlement, ensuring the asset has not been modified.`,
        ],
        url: '',
        voteStartDate: moment(1563814800, 'X'),
        voteEndDate: moment(1564419600, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `Stateful assets can be traded safely on 0x without the risk of front running attacks which can de-value the underlying asset. An asset is guaranteed by the 0x protocol to contain the same state as described in the order during settlement. `,
            ],
            rating: 3,
            links: [
                {
                    text: 'Technical detail',
                    url: 'https://github.com/0xProject/ZEIPs/issues/39',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `There is no risk to user assets in deploying ZEIP-39 as it is incapable of changing any blockchain state.`,
            ],
            rating: 1,
            links: [
                {
                    text: 'View Code',
                    url:
                        'https://github.com/0xProject/0x-monorepo/blob/development/contracts/asset-proxy/contracts/src/StaticCallProxy.sol#L25',
                },
            ],
        },
    },
    24: {
        zeipId: 24,
        title: 'Support ERC-1155 MultiToken Standard',
        summary: [
            `This ZEIP introduces the ERC-1155 Asset Proxy, which adds support for trading ERC-1155 assets to 0x protocol. ERC-1155 is an evolution in token standards allowing mixed fungible and non-fungible assets within the same contract, enabling greater efficiency in the transfer and creation of new token concepts.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/24',
        voteStartDate: moment(1563814800, 'X'),
        voteEndDate: moment(1564419600, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `0x is designed to support numerous assets on the Ethereum blockchain. Adding support for the ERC1155 proxy enables new and more efficient types of trading such as batch transfers, shared deposit contracts and new types of tokens.`,
            ],
            rating: 3,
            links: [
                {
                    text: 'Technical detail',
                    url: 'https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1155.md',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `The ERC1155 AssetProxy’s code is relatively straightforward and has successfully undergone a full third-party audit. Any bug within the ERC1155 Asset Proxy is minimised to only ERC1155 assets.`,
            ],
            rating: 1,
            links: [
                {
                    text: 'View Code',
                    url:
                        'https://github.com/0xProject/0x-monorepo/blob/development/contracts/asset-proxy/contracts/src/ERC1155Proxy.sol#L24',
                },
                {
                    text: 'View Audit',
                    url: 'https://github.com/ConsenSys/0x-audit-report-2019-05',
                },
            ],
        },
    },
    56: {
        zeipId: 56,
        title: '0x Protocol v3',
        summary: [
            `The v3 proposal concerns a major update to 0x protocol. The upgrades fall mainly into three buckets: the introduction of staking contracts, a new pattern supporting bridged liquidity across the DeFi ecosystem, and miscellaneous technical improvements.`,
            `A ZRX staking mechanism grants 0x market makers greater ownership in the protocol and encourages participation in governance by distributing monetary rewards (in ether) and additional voting power for providing liquidity. 0x v3 also introduces a powerful set of bridge contracts that aggregate liquidity from multiple sources including DEXs like Uniswap, Kyber, and Oasis.`,
        ],
        url: 'https://blog.0xproject.com/0x-the-community-owned-liquidity-api-26da5732447e',
        voteStartDate: moment(1572886800, 'X'),
        voteEndDate: moment(1573491600, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `Staking introduces a mechanism to sustain the growth of the 0x ecosystem. It aligns the incentives of token holders with the users that actively participate the most in the network.`,
                `The DEX bridge use cases powered by the new ERC20Bridge will allow projects integrating with 0x to plug into a superset of off-chain and on-chain liquidity, optimizing for the best price.`,
                `The improved exchange functionalities enable, among other things, relayers to introduce fees denominated in any asset, reliable order cancellations for market makers and allow matching relayers to optimize their returns.`,
            ],
            rating: 3,
            links: [
                {
                    text: 'Exchange',
                    url: 'https://github.com/0xProject/0x-protocol-specification/blob/3.0/v3/v3-specification.md',
                },
                {
                    text: 'Staking',
                    url:
                        'https://github.com/0xProject/0x-protocol-specification/blob/3.0/staking/staking-specification.md',
                },
                {
                    text: 'ERC20 Bridge',
                    url:
                        'https://github.com/0xProject/0x-protocol-specification/blob/3.0/asset-proxy/erc20-bridge-proxy.md',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Whilst all the developer tooling has been updated to ease the transition to v3, the introduction of protocol fees paid by the order taker may require developers to update their contract architectures.`,
                `The staking contracts architecture comes with a complex implementation. However, external audits have not surfaced any major vulnerability that would put user funds at risk. The assets handled by the staking contracts are limited to ZRX, WETH (for protocol fees and liquidity rewards).`,
            ],
            rating: 2,
            links: [
                {
                    text: 'Trail of Bits',
                    url: 'http://zeips.0x.org.s3-website.us-east-2.amazonaws.com/audits/56/trail-of-bits/audit.pdf',
                },
                {
                    text: 'Consensys - Exchange',
                    url: 'https://diligence.consensys.net/audits/2019/09/0x-v3-exchange/',
                },
                {
                    text: 'Consensys - Staking',
                    url: 'https://diligence.consensys.net/audits/2019/10/0x-v3-staking/',
                },
            ],
        },
    },
    76: {
        zeipId: 76,
        title: 'Standard ZEIP Process',
        summary: [
            `This ZEIP introduces a standard process to mange the entire lifecycle of ZeroEx Improvement Proposals. This includes: category and phase tags, community polls for core proposals, and mandatory fields such as implementation designated team.`,
            `Absence of a standard in the ZEIP process causes problems in the coordination of the 0x community: vague or unknown purpose of the process itself, unclear expectations on what course of action a ZEIP would take, including whether the proposal would be implemented on or not. The introduction of a standard aims at solving these problems and to create a richer pipeline of proposals from the 0x community.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/76',
        voteStartDate: moment(1585292400, 'X'),
        voteEndDate: moment(1586131200, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `A standardized process ultimately helps to create a high-quality pipeline of improvement proposals for the 0x core contracts, parameters, and other operational aspects of the community.`,
                `The introduction of the intermediary poll for core ZEIP will make sure the community is bought into having the designated team (not necessarily the 0x Core team) spend time and resources to work on the specific proposal. This will become even more important once the funding of the development work (and potential audit) will be coming from the community treasury.`,
                `The entire lifecycle of community-driven proposals and support becomes clearer to outline: general ideas are discussed in the 0x forum, change proposals are formalized into ZEIP, while questions are handled in Discord, Telegram and Reddit.`,
            ],
            rating: 3,
            links: [
                {
                    text: 'ZEIP template',
                    url: 'https://github.com/0xProject/ZEIPs/blob/master/ISSUE_TEMPLATE.md',
                },
                {
                    text: '0x Forum',
                    url: 'https://forum.0x.org/',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Actively managing the process will constitue an overhead cost for the designated ZEIP committee. This latter will consists initially of members of the 0x Core team, but overtime it will have to be open to other members of the community. `,
            ],
            rating: 1,
            links: [],
        },
    },
    77: {
        zeipId: 77,
        title: 'Adjust the length of staking epochs',
        summary: [
            `This ZEIP proposes to decrease the current epoch length from 10 to 7 days. This way, epoch finalizations align to a weekly schedule, to be triggered on Saturdays around 3am GMT.`,
            `This ZEIP also includes a change in administrative timelocks for the StakingProxy and ZrxVault contracts, in order to align them to this new epoch duration. All timelocks for those two contracts with a value of 10 and 20 days will be set to 7 and 14 days, respectively.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/77',
        voteStartDate: moment(1587888000, 'X'),
        voteEndDate: moment(1588737600, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `A shorter epoch duration produces historical data points more often, which helps staking participants (pool operators and ZRX delegators) make their decisions. Also, it also gives stakers a shorter delay between when an action is taken (for example stake ZRX, withdraw ZRX, transfer stake from one pool to another).`,
                `Of all the time intervals available, 7 days represents an obvious choice since it allows stakers and delegators to align on a weekly schedule. Having epochs restart on weekends was the preferred option in informal discussions with the community.`,
            ],
            rating: 2,
            links: [
                {
                    text: 'Initial set of staking parameters',
                    url: 'https://github.com/0xProject/ZEIPs/issues/61',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Staking contracts were designed to safely allow updates of a specific set of parameters via a SetParams function.`,
                `This functionality does not trigger security-critical operations, and was considered safe by external security auditors.`,
            ],
            rating: 1,
            links: [
                {
                    text: 'SetParams function',
                    url:
                        'https://github.com/0xProject/0x-protocol-specification/blob/3.0/staking/staking-specification.md#36-setting-parameters',
                },
                {
                    text: 'Staking security audit',
                    url: 'https://diligence.consensys.net/audits/2019/10/0x-v3-staking/',
                },
            ],
        },
    },
    79: {
        zeipId: 79,
        title: 'Set the protocol fee multiplier to 70,000',
        summary: [
            `This ZEIP proposes to decrease the current protocol fee multiplier from 150,000 to 70,000.  The goal is to lower the barrier of entry for trading 0x v3 liquidity, with the intent of ultimately increasing its adoption and the liquidity rewards received by market makers (and by token holders who stake with them).`,
            `With the increase of average gas price over the last 3 months, Ethereum is a substantially different environment from when the current value was set, hence this proposal. The new value would make the 0x protocol fee roughly equivalent to 10bps (0.10%) of DEX median trade size. Refer to the ZEIP for more details.`,
            `Given the setProtocolFeeMultiplier timelock, if this ZEIP passes, the change will be effective from epoch 28 (starting on 07/18).`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/79',
        voteStartDate: moment(1593867600, 'X'),
        voteEndDate: moment(1594425630, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `A negative correlation was observed between the recent increase of gas prices and the volume of DEX protocols with higher gas cost. `,
                `The goal of reducing the multiplier is to lower the barrier of entry for trading 0x v3 liquidity. For example, a decrease in the fee will make 0x liquidity more competitive on DEX aggregators that take gas cost into account.`,
            ],
            rating: 2,
            links: [
                {
                    text: 'Initial set of staking parameters',
                    url: 'https://github.com/0xProject/ZEIPs/issues/61',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Staking contracts were designed to safely allow updates of a specific set of parameters via a SetParams function.`,
                `This functionality does not trigger security-critical operations, and was considered safe by external security auditors.`,
                `There is a risk that decreasing the fee multiplier will impact the liquidity rewards in the immediate short term.`,
            ],
            rating: 1,
            links: [
                {
                    text: 'SetParams function ',
                    url:
                        'https://github.com/0xProject/0x-protocol-specification/blob/3.0/staking/staking-specification.md#36-setting-parameters',
                },
                {
                    text: 'Staking security audit',
                    url: 'https://diligence.consensys.net/audits/2019/10/0x-v3-staking/',
                },
            ],
        },
    },
    82: {
        zeipId: 82,
        title: '0x Protocol V4',
        summary: [
            `This proposal concerns a major update to 0x protocol. The upgrades fall mainly into three buckets: the introduction of a new smart contracts architecture, gas optimizations to enhance liquidity aggregation, and a new order type designed for Request for Quote liquidity.`,
            `In 2020, a new smart contracts architecture has been tested by 0x Labs directly on production DEX applications. This has proven to be a very effective design change, which contributed to making 0x API the best option for DEX aggregators applications.`,
            `As part of this ZEIP, 0x native order features are natively integrated into these smart contracts pipeline, and registered to start collecting protocol fees. This change completes the upgrade of the canonical 0x protocol to its latest version, 0x v4. `,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/82',
        voteStartDate: moment(1610827244, 'X'),
        voteEndDate: moment(1611414044, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `This latest version brings net improvements across three areas.`,
                `Optimizations in liquidity aggregation and DeFi composability. Thanks to its peer-to-peer protocol design, 0x can represent a superset of liquidity sources, which combined together produce the best price for end users. In addition to that, this version of the protocol introduces the concept of Transformers, which are customizable modules able to execute atomic operations on the traded assets (such as token wrapping/unwrapping, or deposit/withdraw from LP positions).`,
                `It’s the most gas-efficient DEX protocol. Compared to v3, 0x V4 improves RFQ gas costs by almost 70% (our simulations clocked 105k gas VS 320k on v3) and open orderbook gas cost by 10%. This directly translates to cheaper trades and better prices. In addition to that, it is cheaper to trade on both Uniswap and Sushiswap using 0x v4, thanks to an optimized Uniswap router.`,
                `It’s automatically upgradable. The new architecture allows to add or modify specific features without requiring existing 0x applications to ‘migrate’. This means 0x contributors (including but not limited to 0x Labs) can focus on implementing smaller, relevant features at a time. Thanks to this new architecture and to the 0x governance process, the protocol will be able to iterate faster based on what the market needs, without having to wait for the ‘next 0x version’.`,
                `It offers plug&play liquidity. V4 allows custom on-chain liquidity pools to be plugged in via a standard interface and easily aggregated with all other liquidity sources. Whether you're a market maker with a proprietary on-chain strategy or a developer building the next-gen public AMM, V4 can support your use case out of the box.`,
            ],
            rating: 3,
            links: [
                {
                    text: 'Protocol specifications',
                    url: 'https://0xprotocol.readthedocs.io/en/latest/index.html',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `While the 0x v4 contracts architecture is relatively new compared to the previous versions of the protocol, it has been used in production applications in the second half of 2020. Contracts were thoroughly reviewed internally, and audited by Consensys Diligence. No major vulnerabilities were found.`,
                `Moreover, the new architecture comes with the ability to modify or rollback specific features, without halting the entire pipeline of smart contracts. This means that if a vulnerability is found (0x Labs offers generous bug bounties), it is possible to rollback the functionality that exposes the risk.`,
            ],
            rating: 1,
            links: [
                {
                    text: 'Consensys Diligence Security Audit',
                    url: 'https://consensys.net/diligence/audits/2020/12/0x-exchange-v4/',
                },
                {
                    text: '0x v4 Bug Bounty',
                    url: 'https://blog.0xproject.com/0x-protocol-v4-bug-bounty-fd0c1942b9a',
                },
            ],
        },
    },
    83: {
        zeipId: 83,
        title: 'MultiplexFeature, BatchFillNativeOrdersFeature',
        summary: [
            `This ZEIP proposes to integrate MultiplexFeature and BatchFillNativeOrdersFeature. The former is designed to more efficiently perform swaps that use multiple liquidity sources.`,
            `In particular, it enables RFQ orders to be served to 0x API applications without risking reverts, while making the most of the gas savings introduced with 0x V4.`,
            `This should result in more competitive, exclusive liquidity served to applications connected to 0x API.`,
            `The latter introduces batchFill functions for 0x V4 limit and RFQ orders. This functionality was requested by market makers to easily fill multiple orders as part of their arbitrage strategies.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/83',
        voteStartDate: moment(1614790800, 'X'),
        voteEndDate: moment(1615050000, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `Introducing MultiplexFeature will allow RFQ orders to make the most of 0x V4 gas savings (~70% VS 0x V3), as they will not be required to go through the more costly contract pipeline for liquidity aggregation. This will result in more competitive RFQ prices.`,
                `BatchFillNativeOrdersFeature allows multiple 0x V4 orders to be filled in a single function call. In practice, this should improve the execution of smaller limit orders created from Matcha and other 0x limit order integrators.`,
            ],
            rating: 3,
            links: [
                {
                    text: 'Features specifications',
                    url: 'https://protocol.0x.org/',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Contracts were thoroughly reviewed internally, and spot-checked by Consensys Diligence. No vulnerabilities were found. `,
                `0x V4 architecture comes with the ability to modify or rollback specific features, without halting the entire pipeline of smart contracts. This means that if a vulnerability is found (0x Labs offers generous bug bounties), it is possible to rollback the functionality that exposes the risk.`,
            ],
            rating: 1,
            links: [
                {
                    text: '0x v4 Bug Bounty',
                    url: 'https://blog.0xproject.com/0x-protocol-v4-bug-bounty-fd0c1942b9a',
                },
            ],
        },
    },
    84: {
        zeipId: 84,
        title: 'OrderSignerRegistry',
        summary: [
            `Currently, in order to market make on 0x v4, you must hold balances in a normal Ethereum address. 0x Labs has gotten feedback from market makers that it would be useful to be able to store funds in a contract to be able to more easily reuse funds for different market making strategies (e.g. on-chain quoting strategies) and to allow for more complex funds management.`,
            `Signature types that support contract wallets were available in versions 2 and 3 of 0x, so this is bringing v4 into parity with respect to that functionality.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/84',
        voteStartDate: moment(1619024400, 'X'),
        voteEndDate: moment(1619283600, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `Bringing this feature to 0x v4 will unlock additional capital from market makers who use contract wallets to store their funds. More market making capital means better prices for consumers of liquidity (such as Matcha users).`,
            ],
            rating: 3,
            links: [
                {
                    text: 'Features specifications',
                    url: 'https://protocol.0x.org/',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Contracts were thoroughly reviewed internally, and spot-checked by Consensys Diligence. No vulnerabilities were found.`,
                `However, these changes do modify a risk-sensitive part of the codebase: the logic of settling NativeOrder fills.`,
                `0x V4 architecture comes with the ability to modify or rollback specific features, without halting the entire pipeline of smart contracts. This means that if a vulnerability is found (0x Labs offers generous bug bounties), it is possible to rollback the functionality that exposes the risk.`,
            ],
            rating: 2,
            links: [
                {
                    text: '0x v4 Bug Bounty',
                    url: 'https://blog.0xproject.com/0x-protocol-v4-bug-bounty-fd0c1942b9a',
                },
            ],
        },
    },
    88: {
        zeipId: 88,
        title: 'UniswapV3 optimized settlement',
        summary: [
            `This ZEIP proposes to optimize the the integration of Uniswap V3 during settlement, lowering the cost for a significant number of trades.`,
            `As Uniswap V3 is gaining significant volume, it is optimal for our users to access this liquidity source for the lowest cost possible.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/88',
        voteStartDate: moment(1621983600, 'X'),
        voteEndDate: moment(1622242800, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `This feature will significantly reduce the cost for using the Uniswap V3 liquidity source for all users and integrations of 0xAPI`,
            ],
            rating: 3,
            links: [
                {
                    text: 'Features specifications',
                    url: 'https://protocol.0x.org/',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Contracts were thoroughly reviewed internally, and spot-checked by Consensys Diligence. No vulnerabilities were found.`,
                `However, these changes do modify a risk-sensitive part of the codebase: the execution within a privleged environment.`,
                `0x V4 architecture comes with the ability to modify or rollback specific features, without halting the entire pipeline of smart contracts. This means that if a vulnerability is found (0x Labs offers generous bug bounties), it is possible to rollback the functionality that exposes the risk.`,
            ],
            rating: 2,
            links: [
                {
                    text: '0x v4 Bug Bounty',
                    url: 'https://blog.0xproject.com/0x-protocol-v4-bug-bounty-fd0c1942b9a',
                },
            ],
        },
    },
    89: {
        zeipId: 89,
        title: 'ETH support in MultiplexFeature',
        summary: [
            `This ZEIP adds various improvements to MultiplexFeature, most notably the ability to wrap/unwrap ETH as a convenience to the user.`,
            `This reduces the cost of ETH-based trading for users in certain execution flows.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/89',
        voteStartDate: moment(1626195600, 'X'),
        voteEndDate: moment(1626454800, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `This feature will significantly reduce the cost of trades involving ETH for all users and integrations of 0xAPI`,
            ],
            rating: 3,
            links: [
                {
                    text: 'Features specifications',
                    url: 'https://protocol.0x.org/',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Contracts were thoroughly reviewed internally, and spot-checked by Consensys Diligence. No vulnerabilities were found.`,
                `However, these changes do modify a risk-sensitive part of the codebase: the execution within a privleged environment.`,
                `0x V4 architecture comes with the ability to modify or rollback specific features, without halting the entire pipeline of smart contracts. This means that if a vulnerability is found (0x Labs offers generous bug bounties), it is possible to rollback the functionality that exposes the risk.`,
            ],
            rating: 2,
            links: [
                {
                    text: '0x v4 Bug Bounty',
                    url: 'https://blog.0xproject.com/0x-protocol-v4-bug-bounty-fd0c1942b9a',
                },
            ],
        },
    },
    90: {
        zeipId: 90,
        title: 'OTC Orders',
        summary: [
            `This ZEIP introduces a new order format, termed OTC orders, to the 0x V4 protocol.`,
            `OTC orders are a slimmed down version of the existing 0x v4 RFQ order format designed to reduce gas usage.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/90',
        voteStartDate: moment(1629824400, 'X'),
        voteEndDate: moment(1630083600, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [`This feature will significantly reduce the cost of Metatransactions`],
            rating: 3,
            links: [
                {
                    text: 'Features specifications',
                    url: 'https://protocol.0x.org/',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Contracts were thoroughly reviewed internally, and spot-checked by Consensys Diligence. No vulnerabilities were found.`,
                `However, these changes do modify a risk-sensitive part of the codebase: the execution within a privleged environment.`,
                `0x V4 architecture comes with the ability to modify or rollback specific features, without halting the entire pipeline of smart contracts. This means that if a vulnerability is found (0x Labs offers generous bug bounties), it is possible to rollback the functionality that exposes the risk.`,
            ],
            rating: 2,
            links: [
                {
                    text: '0x v4 Bug Bounty',
                    url: 'https://blog.0xproject.com/0x-protocol-v4-bug-bounty-fd0c1942b9a',
                },
            ],
        },
    },
    91: {
        zeipId: 91,
        title: 'Set the protocol fee multiplier to 0',
        summary: [
            `This ZEIP proposes to decrease the protocol fee multiplier from the current value (70,000) to zero (0). The goal is to conduct an experiment that measures the impact on volume in a zero-fee environment to inform decision-making around 0x network economics.`,
            `Protocol fees introduced in 0x v3 have been experiencing a sharp decrease in Q3 due to a combination of decreased activity in open orderbook markets, the emergence of Flashbots as an efficient venue for MEV value capture, and increased competition in open orderbook liquidity protocols.`,
            `A public dashboard will be produced in time for the change to go into effect to monitor its effects. If this proposal is accepted, the update will become effective after 7 days for 0x v3, and 2 days for 0x v4, due to protocol timelocks.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/91',
        voteStartDate: moment(1631725200, 'X'),
        voteEndDate: moment(1631984400, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `The purpose of the experiment is to measure the effect of the protocol fee on limit orders success rate and 0x open orderbook volume as a whole.`,
                `In fact, the presence of the 0x protocol fee requires arbitrageurs to wait for mid-market price to move an extra premium (the cost of the protocol fee) before filling the limit order.`,
            ],
            rating: 4,
            links: [],
        },
        risks: {
            title: 'Risk',
            summary: [
                `The fee multiplier parameter was designed to be updatable to meet evolving environmental conditions. As per the temperature check poll, the community supports this adjustment.`,
                `This change will result in no protocol fees collected, hence halting ZRX staking rewards.`,
                `Updating the multiplier back to the current value or some new value at the conclusion of the measurement period will require a separate vote as the parameter cannot be set to an arbitrary time period. We propose to run this experiment for a period of at least 6 weeks, adding extra 2 weeks to the initial proposal in the temperature check vote. This additional time will allow mitigating the effects of differences in market conditions in the pre/post periods of the analysis.`,
            ],
            rating: 1,
            links: [
                {
                    text: 'Temperature Check',
                    url: 'https://snapshot.org/#/0xgov.eth/proposal/QmUYZwMkDue5RhZGpdGLomsRbKTknmjmjMecz5uz635NFz',
                },
            ],
        },
    },
    93: {
        zeipId: 93,
        title: 'NFT Orders',
        summary: [
            `This ZEIP proposes to add NFT orders to the 0x V4 protocol. Users can now trade ERC-721 and ERC-1155 assets on all the networks 0x supports.`,
            `NFT orders have been built to be up to 54% cheaper than other alternatives.`,
            `Property based orders are supported, enabling traders to create floor bids for any asset.`,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/93',
        voteStartDate: moment(1644879000, 'X'),
        voteEndDate: moment(1645138200, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `Allow users to trade ERC-721 and ERC-1155 assets on all the networks 0x supports.`,
                `Up to 54% cheaper than other alternatives.`,
                `Instant royalties for creators.`,
            ],
            rating: 5,
            links: [
                {
                    text: 'Launch Announcement',
                    url: 'https://blog.0x.org/introducing-multi-chain-nft-swaps/',
                },
            ],
        },
        risks: {
            title: 'Risk',
            summary: [
                `Contracts were thoroughly reviewed internally, and spot-checked by ABDK. No vulnerabilities were found.`,
                `However, these changes do modify a risk-sensitive part of the codebase: the execution within a privileged environment.`,
                `0x V4 architecture comes with the ability to modify or rollback specific features, without halting the entire pipeline of smart contracts. This means that if a vulnerability is found (0x Labs offers generous bug bounties), it is possible to rollback the functionality that exposes the risk.`,
            ],
            rating: 1,
            links: [
                {
                    text: '0x v4 Bug Bounty',
                    url: 'https://blog.0xproject.com/0x-protocol-v4-bug-bounty-fd0c1942b9a',
                },
            ],
        },
    },
};

export const stagingProposals: Proposals = {
    23: {
        ...proposals[23],
        title: 'Trade Bundles of Flowers',
        voteStartDate: moment(Math.floor(Date.now() / 1000), 'X').add(-1, 'day'),
        voteEndDate: moment(Math.floor(Date.now() / 1000), 'X').add(1, 'day'),
    },
    82: {
        ...proposals[82],
        title: '0x Protocol V4',
        voteStartDate: moment(1610827244, 'X'),
        voteEndDate: moment(1611414044, 'X'),
    },
    83: {
        ...proposals[83],
        title: 'MultiplexFeature, BatchFillNativeOrdersFeature',
        voteStartDate: moment(1614790800, 'X'),
        voteEndDate: moment(1615050000, 'X'),
    },
    88: {
        ...proposals[88],
    },
    89: {
        ...proposals[89],
    },
    90: {
        ...proposals[90],
    },
    91: {
        ...proposals[91],
    },
    93: {
        ...proposals[93],
    },
};

export const ZERO_TALLY: TallyInterface = {
    yes: new BigNumber(0),
    no: new BigNumber(0),
};
// tslint:disable:max-file-line-count
