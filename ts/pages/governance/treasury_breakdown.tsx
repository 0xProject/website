import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Web3Wrapper } from '@0x/web3-wrapper';
import { Image } from 'ts/components/ui/image';
import { GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { formatNumber } from 'ts/utils/format_number';

import { ERC20TokenContract } from '@0x/contract-wrappers';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Paragraph } from 'ts/components/text';

import { State } from 'ts/redux/reducer';
import { backendClient } from 'ts/utils/backend_client';

import { PieChart } from 'react-minimal-pie-chart';

import { H1, H2, H3, H4 } from 'ts/components/docs/mdx/headings';

interface TreasuryBreakdownProps {}

interface WrapperProps {}

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

export const TreasuryBreakdown: React.FC<TreasuryBreakdownProps> = (props) => {
    const providerState = useSelector((state: State) => state.providerState);

    const [totalTreasuryAmountUSD, setTotalTreasuryAmountUSD] = React.useState('-');
    const [zrxUSDValue, setZrxUSDValue] = React.useState(undefined);
    const [maticUSDValue, setMaticUSDValue] = React.useState(undefined);
    const [wCeloUSDValue, setWCeloUSDValue] = React.useState(undefined);
    const [assetList, setAssetList] = React.useState([]);
    const [allocations, setAllocations] = React.useState([]);

    React.useEffect(() => {
        const zrxTokenContract = new ERC20TokenContract(
            '0xe41d2489571d322189246dafa5ebde1f4699f498',
            providerState.provider,
        );
        const maticTokenContract = new ERC20TokenContract(
            '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
            providerState.provider,
        );
        const wCeloTokenContract = new ERC20TokenContract(
            '0xe452e6ea2ddeb012e20db73bf5d3863a3ac8d77a',
            providerState.provider,
        );

        // tslint:disable-next-line:no-floating-promises
        (async () => {
            const [zrxBalance, maticBalance, wCeloBalance] = await Promise.all([
                zrxTokenContract.balanceOf(GOVERNOR_CONTRACT_ADDRESS.ZRX).callAsync(),
                maticTokenContract.balanceOf(GOVERNOR_CONTRACT_ADDRESS.ZRX).callAsync(),
                wCeloTokenContract.balanceOf(GOVERNOR_CONTRACT_ADDRESS.ZRX).callAsync(),
            ]);
            const treasuryTokenPrices = await backendClient.getTreasuryTokenPricesAsync();
            const getTokenPrice = (tokenSymbol: string) => {
                const symbolIdMap: { [symbol: string]: string } = {
                    'ZRX': '0x',
                    'MATIC': 'matic-network',
                    'wCELO': 'celo'
                }
                const priceId = symbolIdMap[tokenSymbol];
                const price = treasuryTokenPrices[priceId].usd;

                return price;
            }
            const zrxAmount = Web3Wrapper.toUnitAmount(zrxBalance, 18);
            const maticAmount = Web3Wrapper.toUnitAmount(maticBalance, 18);
            const wCeloAmount = Web3Wrapper.toUnitAmount(wCeloBalance, 18);

            const zrxUSD = zrxAmount.multipliedBy(getTokenPrice('ZRX'));
            const maticUSD = maticAmount.multipliedBy(getTokenPrice('MATIC'));
            const wCeloUSD = wCeloAmount.multipliedBy(getTokenPrice('wCELO'));

            setZrxUSDValue(zrxUSD);
            setMaticUSDValue(maticUSD);
            setWCeloUSDValue(wCeloUSD);
            setAssetList([
                {
                    name: 'ZRX',
                    balance: zrxAmount.toString(),
                    usdValue: `$${
                        formatNumber(zrxUSD.toString(), {
                            decimals: 0,
                            decimalsRounded: 6,
                            bigUnitPostfix: false,
                        }).formatted
                    }`,
                },
                {
                    name: 'MATIC',
                    balance: maticAmount.toString(),
                    usdValue: `$${
                        formatNumber(maticUSD.toString(), {
                            decimals: 0,
                            decimalsRounded: 6,
                            bigUnitPostfix: false,
                        }).formatted
                    }`,
                },
                {
                    name: 'wCELO',
                    balance: wCeloAmount.toString(),
                    usdValue: `$${
                        formatNumber(wCeloUSD.toString(), {
                            decimals: 0,
                            decimalsRounded: 6,
                            bigUnitPostfix: false,
                        }).formatted
                    }`,
                },
            ]);

            const treauryProposalDistributions = await backendClient.getTreasuryProposalDistributionsAsync(
                providerState.provider,
            );

            const treasuryAllocations = treauryProposalDistributions.map((distribution: any) => {
                const { tokensTransferred } = distribution;
                const updatedTokensTransferred = tokensTransferred.map((token: any) => {
                    token.usdValue = Math.round(token.amount * getTokenPrice(token.name));

                    return token;
                });
                distribution.tokensTransferred = updatedTokensTransferred;
                return distribution;
            });

            setAllocations(treasuryAllocations);

            setTotalTreasuryAmountUSD(
                `$${
                    formatNumber(zrxUSD.plus(maticUSD).plus(wCeloUSD).toString(), {
                        decimals: 6,
                        decimalsRounded: 6,
                        bigUnitPostfix: true,
                    }).formatted
                }`,
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
                                {zrxUSDValue && maticUSDValue && wCeloUSDValue && (
                                    <PieChart
                                        data={[
                                            {
                                                title: 'ZRX',
                                                value: parseInt(zrxUSDValue.toString(), 10),
                                                color: '#000000',
                                            },
                                            {
                                                title: 'MATIC',
                                                value: parseInt(maticUSDValue.toString(), 10),
                                                color: '#8247E5',
                                            },
                                            {
                                                title: 'wCELO',
                                                value: parseInt(wCeloUSDValue.toString(), 10),
                                                color: '#fcc44c',
                                            },
                                        ]}
                                        label={(data: any) => `${Math.round(data.dataEntry.percentage)}%`}
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
                                <LegendItem>
                                    <ColorBlock color={'#fcc44c'} /> wCelo
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
                                    assetList.map((data, index) => {
                                        return (
                                            <AssetRow key={index}>
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
                                allocations.map((data, alloctionsIndex) => {
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
                                    const usd = `$${
                                        formatNumber(summedTokenValue, {
                                            decimals: 0,
                                            decimalsRounded: 6,
                                            bigUnitPostfix: false,
                                        }).formatted
                                    }`;
                                    return (
                                        <AssetRow key={alloctionsIndex}>
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
// tslint:disable:max-file-line-count
