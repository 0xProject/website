import * as React from 'react';
import styled from 'styled-components';
import { Progressbar } from 'ts/components/progressbar';
import { stakingUtils } from 'ts/utils/staking_utils';
import { configs, GOVERNANCE_THEGRAPH_ENDPOINT, GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { Web3Wrapper } from '@0x/web3-wrapper';
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

import { differenceInSeconds } from 'date-fns';

import { formatEther, formatZrx } from 'ts/utils/format_number';

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
    margin-left: 2rem;
`;

interface ColorBlockProps {
    color: string;
}

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
    text-align: left;
    padding: 15px 80px;
    font-size: 15px;
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
const VoteRowAddress = styled.td`
    padding: 0.5rem 0;
    display: flex;
`;

const FiguresListHeader = styled.h2``;

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
                    balance: zrxAmount,
                    usdValue: zrxUSD,
                },
                {
                    name: 'ZRX',
                    balance: zrxAmount,
                    usdValue: zrxUSD,
                },
            ]);

            const treasuryTokenTransferData = await backendClient.getTreasuryTokenTransfers();
            const totalDistributed = parseTotalDistributed(treasuryTokenTransferData);

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
                <H1>ZRX Treasury Breakdown</H1>
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
                                                title: 'Matic',
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
                            <Paragraph>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet posuere justo,
                                quis scelerisque odio. Praesent sollicitudin magna libero, eget elementum dolor sagittis
                                ut. Nunc scelerisque euismod sodales. Ut libero justo, pretium vel tortor eget, faucibus
                                rutrum erat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
                                cubilia curae; In euismod vitae urna eu ornare. Integer eleifend orci ac lobortis
                                vehicula
                            </Paragraph>
                        </BreakdownCopy>
                    </Column>
                    <Column>
                        <H2>Assets</H2>

                        <AssetsTable>
                            <TableHeader>
                                <tr>
                                    <TableHeaderElement>Asset</TableHeaderElement>
                                    <TableHeaderElement>Balance</TableHeaderElement>
                                    <TableHeaderElement>Value</TableHeaderElement>
                                </tr>
                            </TableHeader>
                            {/* <tbody>
                                {data.map((voteData: VoterBreakdownData) => {
                                    return (
                                        <VoteRow>
                                            <VoteRowAddress>
                                                <Jazzicon
                                                    isSquare={true}
                                                    diameter={28}
                                                    seed={generateUniqueId(voteData.voter)}
                                                />
                                                <VoterAddress>
                                                    {voteData.voterName ||
                                                        utils.getAddressBeginAndEnd(voteData.voter, 4, 4)}
                                                </VoterAddress>
                                            </VoteRowAddress>
                                            <VoteRowSupport supportColor={voteData.support ? 'green' : 'red'}>
                                                {voteData.support ? 'Yes' : 'No'}
                                            </VoteRowSupport>
                                            <VoteRowPower>{voteData.votingPower}</VoteRowPower>
                                        </VoteRow>
                                    );
                                })}
                            </tbody> */}
                        </AssetsTable>
                    </Column>
                </ColumnsWrapper>
                <TreasuryAllocations>
                    <H2>Historical Treasury Allocations</H2>
                </TreasuryAllocations>
            </Wrapper>
        </StakingPageLayout>
    );
};

TreasuryBreakdown.defaultProps = {};