import * as React from 'react';
import styled from 'styled-components';
import { Progressbar } from 'ts/components/progressbar';
import { stakingUtils } from 'ts/utils/staking_utils';
import { configs, GOVERNANCE_THEGRAPH_ENDPOINT, GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { ethers, Contract } from 'ethers';
import { Image } from 'ts/components/ui/image';

import { formatNumber } from 'ts/utils/format_number';

import { getContractAddressesForChainOrThrow } from '@0x/contract-addresses';
import { ERC20TokenContract } from '@0x/contract-wrappers';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { BigNumber } from '@0x/utils';
import { useSelector } from 'react-redux';
import { utils } from 'ts/utils/utils';

import { Section } from 'ts/components/newLayout';
import { Heading, Paragraph } from 'ts/components/text';
import { Text } from 'ts/components/ui/text';

import { State } from 'ts/redux/reducer';
import { backendClient } from 'ts/utils/backend_client';

import { colors } from 'ts/style/colors';
import { PieChart } from 'react-minimal-pie-chart';

import { H3, H4, H2, H1 } from 'ts/components/docs/mdx/headings';

interface TreasuryBreakdownProps {}

interface WrapperProps {}

interface InnerProps {}

interface RowProps {}

const ProgressbarText = styled.span`
    display: block;
    font-size: 15px;
    color: #5c5c5c;
    line-height: 1.2;
    margin-top: 8px;
`;

const Wrapper = styled.div<WrapperProps>`
    width: 100%;
    text-align: center;
    max-width: 1450px;
    margin: 0 auto;
    @media (min-width: 768px) {
        padding: 30px;
        text-align: left;
    }
`;

const Inner = styled.div<InnerProps>`
    background-color: #f3f6f4;
    background-image: url(/images/stakingGraphic.svg);
    background-repeat: no-repeat;
    background-position-x: right;
    background-position-y: center;
    @media (min-width: 768px) {
        padding: 30px;
    }
`;

const Row = styled.div<RowProps>`
    max-width: 1152px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    @media (min-width: 768px) {
        flex-direction: row;
        & > * {
        }
    }
`;

const Column = styled.div`
    width: 50%;

    @media (max-width: 1024px) {
        width: 100%;
    }
`;

const AssetsColumn = styled.div`
    width: auto;
`;

const Title = styled.h1`
    font-size: 46px;
    line-height: 1.2;
    font-weight: 300;
    margin-bottom: 20px;
    display: none;
    @media (min-width: 768px) {
        font-size: 50px;
        display: block;
    }
`;

const TitleMobile = styled(Title)`
    display: block;
    @media (min-width: 768px) {
        display: none;
    }
`;

const Description = styled.h2`
    font-size: 18px;
    line-height: 1.45;
    font-weight: 300;
    margin-bottom: 30px;
    color: ${colors.textDarkSecondary};
`;

const Actions = styled.div`
    & > * {
        margin-right: 13px;
        margin-bottom: 10px;
    }
`;

const MetricsWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const FiguresList = styled.ol`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-top: 15px;
    width: 250px;
`;

const Figure = styled.li`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    background-color: ${colors.white};
    padding: 10px;
    margin-bottom: 15px;
    @media (min-width: 480px) {
        padding: 20px;
    }
`;

const FigureHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
`;

const FigureTitle = styled.span`
    display: block;
    font-size: 16px;
    line-height: 1.35;
    color: #999999;
    margin-bottom: 5px;
`;

const FigureNumber = styled.span`
    display: block;
    font-feature-settings: 'tnum' on, 'lnum' on;
    font-size: 20px;
    line-height: 1.35;
    @media (min-width: 768px) {
        font-size: 24px;
    }
    @media (min-width: 991px) {
        font-size: 28px;
    }
`;

const ColumnsWrapper = styled.div`
    display: flex;

    @media (max-width: 1024px) {
        flex-direction: column;
    }
`;
const PieChartWrapper = styled.div`
    width: 40%;
`;

const PieAndLegend = styled.div`
    display: flex;
    justify-content: center;
`;

const Legend = styled.div`
    display: flex-column;
    margin-left: 4rem;
`;

interface ColorBlockProps {
    color: string;
}

const ProposalLink = styled.a`
    color: #00ae99;

    &:hover {
        text-decoration: underline;
    }
`;

const ColorBlock = styled.div<ColorBlockProps>`
    background-color: ${(props) => props.color};
    width: 10px;
    height: 10px;

    margin-top: 2px;
    margin-right: 10px;
`;
const LegendItem = styled.div`
    display: flex;
    margin-bottom: 5px;
`;

const BreakdownCopy = styled.div`
    margin-top: 4rem;
`;
const AssetListWrapper = styled.div``;
const TreasuryAllocations = styled.div`
    padding-top: 2rem;
`;

const AssetsTable = styled.table`
    width: 100%;
    margin-bottom: 0.5rem;
`;

const TableHeaderElement = styled.th`
    text-align: center;
    padding: 15px 80px;
    font-size: 15px;

    @media (max-width: 1024px) {
        padding: 15px 25px;
    }
`;

const TableHeader = styled.thead`
    background-color: #ebefee;
    color: #898990;
`;

const VoteTableHeaderElementSupport = styled.th`
    text-align: center;
`;

const VoteTableHeaderElementPower = styled.th`
    text-align: right;
`;
const AssetName = styled.td`
    text-align: center;
    font-size: 20px;
    padding-top: 2rem;

    @media (max-width: 600px) {
        font-size: 15px;
    }
`;

const AssetBalance = styled.td`
    text-align: center;
    font-size: 20px;

    @media (max-width: 600px) {
        font-size: 15px;
    }
`;

const AssetValue = styled.td`
    text-align: center;
    font-size: 20px;

    @media (max-width: 600px) {
        font-size: 15px;
    }
`;

const AssetRow = styled.tr``;

const CTADisplay = styled.div`
    display: flex;
    background-color: #f3f6f4;
    width: 100%;
    color: #5c5c5c;
    justify-content: center;
    margin-top: 2rem;

    @media (max-width: 600px) {
        padding-left: 2em;
    }
`;

const CTADisplayText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 2.5rem 4rem;
`;

const CTALink = styled.a`
    margin-top: 1rem;
    color: #00ae99;
`;

const ArrowCTA = styled.svg`
    margin-left: 0.25rem;
    margin-top: -4px;
`;

type TreasuryTokenPricesUsd = {
    zrx: number;
    matic: number;
};

export const TreasuryBreakdown: React.FC<TreasuryBreakdownProps> = (props) => {
    const providerState = useSelector((state: State) => state.providerState);

    const [totalTreasuryAmountUSD, setTotalTreasuryAmountUSD] = React.useState('-');
    const [totalTreasuryDistributedUSD, setTotalTreasuryDistributedUSD] = React.useState('-');
    const [zrxBalance, setZrxBalance] = React.useState(undefined);
    const [maticBalance, setMaticBalance] = React.useState(undefined);
    const [zrxUSDValue, setZrxUSDValue] = React.useState(undefined);
    const [maticUSDValue, setMaticUSDValue] = React.useState(undefined);
    const [assetList, setAssetList] = React.useState([]);
    const [allocations, setAllocations] = React.useState([]);

    const parseTotalDistributed = (transferData: any) => {
        let totalDistributed = 0;
        if (transferData) {
            transferData.forEach((tf: any) => {
                if (tf.data.items) {
                    tf.data.items.forEach((item: any) => {
                        item.transfers.forEach((transfer: any) => {
                            if (transfer.transfer_type === 'OUT') {
                                totalDistributed += transfer.delta_quote;
                            }
                        });
                    });
                }
            });
        }

        return totalDistributed;
    };

    React.useEffect(() => {
        const zrxTokenContract = new ERC20TokenContract(
            '0xe41d2489571d322189246dafa5ebde1f4699f498',
            providerState.provider,
        );
        const maticTokenContract = new ERC20TokenContract(
            '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
            providerState.provider,
        );

        (async () => {
            const [zrxBalance, maticBalance] = await Promise.all([
                zrxTokenContract.balanceOf(GOVERNOR_CONTRACT_ADDRESS.ZRX).callAsync(),
                maticTokenContract.balanceOf(GOVERNOR_CONTRACT_ADDRESS.ZRX).callAsync(),
            ]);
            const res = await backendClient.getTreasuryTokenPrices();
            const zrxAmount = Web3Wrapper.toUnitAmount(zrxBalance, 18);
            const maticAmount = Web3Wrapper.toUnitAmount(maticBalance, 18);

            const zrxUSD = zrxAmount.multipliedBy(res['0x'].usd);
            const maticUSD = maticAmount.multipliedBy(res['matic-network'].usd);

            setZrxBalance(zrxAmount);
            setMaticBalance(maticAmount);
            setZrxUSDValue(zrxUSD);
            setMaticUSDValue(maticUSD);
            setAssetList([
                {
                    name: 'ZRX',
                    balance: zrxAmount.toString(),
                    usdValue:
                        '$' +
                        formatNumber(zrxUSD.toString(), {
                            decimals: 0,
                            decimalsRounded: 6,
                            bigUnitPostfix: false,
                        }).formatted,
                },
                {
                    name: 'MATIC',
                    balance: maticAmount.toString(),
                    usdValue:
                        '$' +
                        formatNumber(maticUSD.toString(), {
                            decimals: 0,
                            decimalsRounded: 6,
                            bigUnitPostfix: false,
                        }).formatted,
                },
            ]);

            const treasuryTokenTransferData = await backendClient.getTreasuryTokenTransfers();
            const totalDistributed = parseTotalDistributed(treasuryTokenTransferData);

            const treauryProposalDistributions = await backendClient.getTreasuryProposalDistributions(
                providerState.provider,
            );

            console.log(treauryProposalDistributions);
            const treasuryAllocations = treauryProposalDistributions.map((distribution: any) => {
                const { tokensTransferred } = distribution;

                let updatedTokensTransferred = tokensTransferred.map((token: any) => {
                    if (token.name === 'ZRX') {
                        token.usdValue = Math.round(token.amount * res['0x'].usd);
                    } else {
                        token.usdValue = Math.round(token.amount * res['matic-network'].usd);
                    }
                    return token;
                });
                distribution.tokensTransferred = updatedTokensTransferred;
                return distribution;
            });

            setAllocations(treasuryAllocations);
            setTotalTreasuryDistributedUSD(
                '$' +
                    formatNumber(totalDistributed, {
                        decimals: 6,
                        decimalsRounded: 6,
                        bigUnitPostfix: true,
                    }).formatted,
            );
            setTotalTreasuryAmountUSD(
                '$' +
                    formatNumber(zrxUSD.plus(maticUSD).toString(), {
                        decimals: 6,
                        decimalsRounded: 6,
                        bigUnitPostfix: true,
                    }).formatted,
            );
        })();
    }, [providerState]);

    return (
        <StakingPageLayout isHome={false} title="0x Governance">
            <Wrapper>
                <H1>0x DAO Treasury Breakdown</H1>
                <ColumnsWrapper>
                    <Column>
                        <Title>{totalTreasuryAmountUSD}</Title>
                        <PieAndLegend>
                            <PieChartWrapper>
                                {zrxUSDValue && maticUSDValue && (
                                    <PieChart
                                        data={[
                                            { title: 'ZRX', value: parseInt(zrxUSDValue.toString()), color: '#000000' },
                                            {
                                                title: 'MATIC',
                                                value: parseInt(maticUSDValue.toString()),
                                                color: '#8247E5',
                                            },
                                        ]}
                                        label={(data: any) => Math.round(data.dataEntry.percentage) + '%'}
                                        labelStyle={{
                                            fontSize: '8px',
                                            fontFamily: 'sans-serif',
                                            fill: '#f5f5f5',
                                        }}
                                    />
                                )}
                            </PieChartWrapper>
                            <Legend>
                                <H4>Legend</H4>
                                <LegendItem>
                                    <ColorBlock color={'#000000'} /> ZRX
                                </LegendItem>
                                <LegendItem>
                                    <ColorBlock color={'#8247E5'} /> Matic
                                </LegendItem>
                            </Legend>
                        </PieAndLegend>
                        <BreakdownCopy>
                            <H3>Govern the entire treasury with your ZRX</H3>
                            <Paragraph
                                style={{
                                    paddingRight: '1rem',
                                }}
                            >
                                The intended purpose of the treasury is to fund activities and projects that benefit and
                                add value to the 0x ecosystem. ZRX holders fully control the treasury. Anyone can submit
                                a governance proposal to use the funds or apply for funding themselves.
                            </Paragraph>
                        </BreakdownCopy>
                    </Column>
                    <AssetsColumn>
                        <H2>Assets</H2>
                        <AssetsTable>
                            <TableHeader>
                                <tr>
                                    <TableHeaderElement>Asset</TableHeaderElement>
                                    <TableHeaderElement>Balance</TableHeaderElement>
                                    <TableHeaderElement>Value</TableHeaderElement>
                                </tr>
                            </TableHeader>
                            <tbody>
                                {assetList &&
                                    assetList.map((data) => {
                                        return (
                                            <AssetRow>
                                                <AssetName>{data.name}</AssetName>
                                                <AssetBalance>{data.balance}</AssetBalance>
                                                <AssetValue>{data.usdValue}</AssetValue>
                                            </AssetRow>
                                        );
                                    })}
                            </tbody>
                        </AssetsTable>
                        <CTADisplay>
                            <Image src="/images/treasury_breakdown/treasury_breakdown_eve.png" />
                            <CTADisplayText>
                                Have an idea that requires funding?
                                <br />
                                <CTALink href="https://app.gitbook.com/@0xdao/s/0x-dao/ecosystem-value-experiment/0xdao-grant-program-framework-v1">
                                    Apply for funds with 0x Eve
                                    <ArrowCTA
                                        fill="#00AE99"
                                        height="15"
                                        viewBox="0 0 16 15"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M4.484.246l.024 1.411 8.146.053L.817 13.547l.996.996L13.65 2.706l.052 8.146 1.412.024L15.045.315 4.484.246z" />
                                    </ArrowCTA>
                                </CTALink>
                            </CTADisplayText>
                        </CTADisplay>
                        <CTADisplay>
                            <Image src="/images/treasury_breakdown/treasury_breakdown_past.png" />
                            <CTADisplayText>
                                Have an idea that requires funding?
                                <br />
                                <CTALink href="/zrx/vote">
                                    View all active and past proposals
                                    <ArrowCTA
                                        fill="#00AE99"
                                        height="15"
                                        viewBox="0 0 16 15"
                                        width="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M4.484.246l.024 1.411 8.146.053L.817 13.547l.996.996L13.65 2.706l.052 8.146 1.412.024L15.045.315 4.484.246z" />
                                    </ArrowCTA>
                                </CTALink>
                            </CTADisplayText>
                        </CTADisplay>
                    </AssetsColumn>
                </ColumnsWrapper>
                <TreasuryAllocations>
                    <H2>Historical Treasury Allocations</H2>
                    <AssetsTable>
                        <TableHeader>
                            <tr>
                                <TableHeaderElement>Proposal</TableHeaderElement>
                                <TableHeaderElement>Transfer Funds</TableHeaderElement>
                                <TableHeaderElement>USD Value</TableHeaderElement>
                            </tr>
                        </TableHeader>
                        <tbody>
                            {allocations &&
                                allocations.map((data) => {
                                    let summedTokenValue = 0;
                                    let tokenAmountsString = '';
                                    data.tokensTransferred.forEach((token: any, index: number) => {
                                        summedTokenValue += token.usdValue;
                                        const formattedTokenAmount = formatNumber(token.amount, {
                                            decimals: 0,
                                            decimalsRounded: 6,
                                            bigUnitPostfix: true,
                                        }).formatted;
                                        tokenAmountsString += `${token.name} ${formattedTokenAmount}`;
                                        if (index < data.tokensTransferred.length - 1) {
                                            tokenAmountsString += ', ';
                                        }
                                    });
                                    const proposalTitle = `Proposal #${data.proposalId}`;
                                    const usd =
                                        '$' +
                                        formatNumber(summedTokenValue, {
                                            decimals: 0,
                                            decimalsRounded: 6,
                                            bigUnitPostfix: false,
                                        }).formatted;
                                    return (
                                        <AssetRow>
                                            <AssetName>
                                                <ProposalLink href={`https://etherscan.io/tx/${data.hash}`}>
                                                    {proposalTitle}
                                                </ProposalLink>
                                            </AssetName>
                                            <AssetBalance>{tokenAmountsString}</AssetBalance>
                                            <AssetValue>{usd}</AssetValue>
                                        </AssetRow>
                                    );
                                })}
                        </tbody>
                    </AssetsTable>
                </TreasuryAllocations>
            </Wrapper>
        </StakingPageLayout>
    );
};

TreasuryBreakdown.defaultProps = {};
