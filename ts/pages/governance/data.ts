import { BigNumber } from '@0x/utils';
import * as moment from 'moment';

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
                    text: 'View Audit (Available Soon)',
                    url: 'https://github.com/ConsenSys/0x-audit-report-2019-11',
                },
            ],
        },
    },
};

export const ZERO_TALLY: TallyInterface = {
    yes: new BigNumber(0),
    no: new BigNumber(0),
};
