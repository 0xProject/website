import { Web3Wrapper } from '@0x/web3-wrapper';
import * as React from 'react';
import styled from 'styled-components';
import { GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { formatNumber } from 'ts/utils/format_number';

import { ERC20TokenContract } from '@0x/contract-wrappers';

import { BigNumber } from '@0x/utils';
import { useSelector } from 'react-redux';

import { State } from 'ts/redux/reducer';
import { backendClient } from 'ts/utils/backend_client';

import { ZeroExProvider } from '@0x/asset-buyer';
import { colors } from 'ts/style/colors';

interface GovernanceHeroProps {
    title: string | React.ReactNode;
    numProposals?: number | null;
    titleMobile: string | React.ReactNode;
    description: string | React.ReactNode;
    figure: React.ReactNode;
    actions: React.ReactNode;
    provider?: ZeroExProvider;
    videoId?: string;
    videoChannel?: string;
    videoRatio?: string;
    youtubeOptions?: any;
    averageVotingPower?: number | undefined;
    metrics?: {
        zrxStaked: number;
        currentEpochRewards: BigNumber;
        nextEpochStartDate: Date;
    };
}

interface WrapperProps {}

interface InnerProps {}

interface RowProps {}

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
    padding: 30px;
    @media (min-width: 768px) {
        padding: 60px 28px;
        &:first-child {
            padding-left: 0;
        }
        &:last-child {
            padding-right: 0;
        }
    }
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
    display: flex;
    flex-direction: column;
    & > * {
        margin-right: 13px;
        margin-bottom: 10px;
    }
    @media (min-width: 768px) {
        flex-direction: row;
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
`;

const Figure = styled.li`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    padding: 10px;
    margin-bottom: 15px;
    max-width: 50%;
    @media (min-width: 480px) {
        padding: 20px;
    }
`;

const FigurePair = styled.div`
    display: flex;
    justify-content: space-between;
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
    margin-bottom: 5px;
`;

const FigureNumber = styled.span`
    display: block;
    font-feature-settings: 'tnum' on, 'lnum' on;
    font-size: 20px;
    line-height: 1.35;
    @media (min-width: 768px) {
        font-size: 34px;
    }
    @media (min-width: 991px) {
        font-size: 44px;
    }
`;

export const GovernanceHero: React.FC<GovernanceHeroProps> = (props) => {
    const { title, titleMobile, description, actions, numProposals, averageVotingPower } = props;
    const providerState = useSelector((state: State) => state.providerState);

    const [totalTreasuryAmountUSD, setTotalTreasuryAmountUSD] = React.useState('-');
    const [totalTreasuryDistributedUSD, setTotalTreasuryDistributedUSD] = React.useState('-');

    const parseTotalDistributed = (transferData: any) => {
        let totalDistributed = 0;
        if (transferData) {
            transferData.forEach((tf: any) => {
                if (tf.data.items) {
                    tf.data.items.forEach((item: any) => {
                        item.transfers.forEach((transfer: any) => {
                            if (transfer.transfer_type === 'OUT') {
                                const delta_quote =
                                    parseInt(transfer.delta, 10) *
                                    Math.pow(10, -transfer.contract_decimals) *
                                    transfer.quote_rate;

                                totalDistributed += delta_quote;
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

        // tslint:disable-next-line:no-floating-promises
        (async () => {
            const [zrxBalance, maticBalance] = await Promise.all([
                zrxTokenContract.balanceOf(GOVERNOR_CONTRACT_ADDRESS.ZRX).callAsync(),
                maticTokenContract.balanceOf(GOVERNOR_CONTRACT_ADDRESS.ZRX).callAsync(),
            ]);
            const res = await backendClient.getTreasuryTokenPricesAsync();
            const zrxAmount = Web3Wrapper.toUnitAmount(zrxBalance, 18);
            const maticAmount = Web3Wrapper.toUnitAmount(maticBalance, 18);
            const zrxUSD = zrxAmount.multipliedBy(res['0x'].usd);
            const maticUSD = maticAmount.multipliedBy(res['matic-network'].usd);

            const treasuryTokenTransferData = await backendClient.getTreasuryTokenTransfersAsync();
            const totalDistributed = parseTotalDistributed(treasuryTokenTransferData);
            setTotalTreasuryDistributedUSD(
                `$${
                    formatNumber(totalDistributed, {
                        decimals: 6,
                        decimalsRounded: 6,
                        bigUnitPostfix: true,
                    }).formatted
                }`,
            );
            setTotalTreasuryAmountUSD(
                `$${
                    formatNumber(zrxUSD.plus(maticUSD).toString(), {
                        decimals: 6,
                        decimalsRounded: 6,
                        bigUnitPostfix: true,
                    }).formatted
                }`,
            );
        })();
    }, [providerState]);

    const averageVotingPowerFormatted = averageVotingPower
        ? formatNumber(averageVotingPower, {
              decimals: 6,
              decimalsRounded: 6,
              bigUnitPostfix: true,
          }).formatted
        : '-';
    return (
        <Wrapper>
            <Inner>
                <Row>
                    <Column>
                        <Title>{title}</Title>
                        <TitleMobile>{titleMobile}</TitleMobile>
                        <Description>{description}</Description>
                        <Actions>{actions}</Actions>
                    </Column>
                    <Column>
                        <MetricsWrapper>
                            {/* <FiguresListHeader>Treasury Stats</FiguresListHeader> */}
                            <FiguresList>
                                <FigurePair>
                                    <Figure key={1}>
                                        <FigureHeader>
                                            <FigureTitle>Available Treasury</FigureTitle>
                                        </FigureHeader>
                                        <FigureNumber>{totalTreasuryAmountUSD}</FigureNumber>
                                    </Figure>
                                    <Figure key={2}>
                                        <FigureHeader>
                                            <FigureTitle>Total Distributed</FigureTitle>
                                        </FigureHeader>
                                        <FigureNumber>{totalTreasuryDistributedUSD}</FigureNumber>
                                    </Figure>
                                </FigurePair>

                                <FigurePair>
                                    <Figure key={3}>
                                        <FigureHeader>
                                            <FigureTitle>Votes Passed</FigureTitle>
                                        </FigureHeader>
                                        <FigureNumber>{numProposals || 0}</FigureNumber>
                                    </Figure>
                                    <Figure key={4} style={{}}>
                                        <FigureHeader>
                                            <FigureTitle>Avg. ZRX Voted Per Proposal</FigureTitle>
                                        </FigureHeader>
                                        <FigureNumber>{averageVotingPowerFormatted}</FigureNumber>
                                    </Figure>
                                </FigurePair>
                                {/* <ProgressbarText>Treasury Details</ProgressbarText> */}
                            </FiguresList>
                        </MetricsWrapper>
                    </Column>
                </Row>
            </Inner>
        </Wrapper>
    );
};

GovernanceHero.defaultProps = {
    videoChannel: 'youtube',
    videoRatio: '21:9',
};
