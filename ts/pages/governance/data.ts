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
            `This vote concerns a major update to 0x protocol. The changes fall mainly in three buckets: the introduction of staking contracts, a new pattern supporting bridged liquidity across protocols, and miscellaneous technical improvements and new features.`,
            `The new staking contracts support a ZRX staking mechanism that grant 0x market makers greater ownership in the protocol, as they provide the necessary liquidity for the markets running on the network. Maker makers form pools to receive liquidity rewards and participate in governance. Liquidity rewards are sustained by the introduction of a small protocol fee, paid by the taker when filling orders. The fee is calculated as a portion of the gas price. Any ZRX holder can earn a portion of liquidity rewards by delegating their ZRX to market maker pools. Learn more about ZRX staking here.`,
            `The ERC20BridgeProxy contract allows for the execution of ERC-20 transactions with assets that are locked in other contracts. The design patterns allows for DEX bridges to access sources of on-chain liquidity from DEXs like Kyber, Oasis, and Uniswap. Learn more about liquidity bridges here.`,
            `Finally, in this vote proposal, the exchange expands and improves multiple features. The most notable ones are: the introduction of arbitrary fees (previously only on ZRX), idempotent order cancellations, a more profitable matching orders function and richer error reverts. Check out the entire changelog on Github. `,
        ],
        url: 'https://github.com/0xProject/ZEIPs/issues/56',
        voteStartDate: moment(1571909179, 'X'),
        voteEndDate: moment(1574069179, 'X'),
        benefit: {
            title: 'Benefit',
            summary: [
                `ZRX staking introduces a scalable mechanism to sustain the growth of the ecosystem, aligning incentives of token holders with the class of users that participate the most in the network.`,
                `The DEX bridge use cases powered by the new ERC20Bridge will allow projects integrating with 0x to plug into a superset of off-chain and on-chain pool liquidity, at the best price.`,
                `The improved exchange functionalities enable, among other things, relayers to introduce fees denominated in any asset, market makers to have more reliable cancellations and matching relayers to maximize their profits. `,
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
                `While all the developer tooling has been updated to ease out the transition, the introduction of protocol fees paid by the order taker might require developers to update their architectures, therefore introducing barriers to migration.`,

                `There are three assets that are handled by staking contracts: ZRX, WETH (to pay protocol fees), and rewards calculation and distribution to users. The three areas are isolated in the code. In particular, the ones handling ZRX and WETH balances (the most sensitive ones) were considered safe by auditors. It was flagged that the code implementation for rewards calculation and distribution was complex, which might introduce risk, even though no possible exploits were found.`,
            ],
            rating: 2,
            links: [
                {
                    text: 'View Audit',
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
