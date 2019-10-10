import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Button } from 'ts/components/button';
import { MarketMaker } from 'ts/components/staking/wizard/MarketMaker';
import { NumberInput } from 'ts/components/staking/wizard/NumberInput';
import { Status } from 'ts/components/staking/wizard/Status';
import { Timeline } from 'ts/components/staking/wizard/Timeline';
import { TransactionItem } from 'ts/components/staking/wizard/TransactionItem';

export interface StakingWizardProps {}

interface SplitviewProps {
    leftComponent: React.ReactNode;
    rightComponent: React.ReactNode;
}

const Container = styled.div`
    max-width: 1390px;
    margin: 0 auto;
    position: relative;
`;

const Inner = styled.div`
    border: 1px solid #E3E3E3;
    background-color: ${colors.white};
    padding: 30px;
`;

const SplitviewContainer = styled.div`
    display: flex;
    flex-direction: column;

    @media (min-width: 900px) {
        flex-direction: row;
    }

    & > div {
        @media (min-width: 900px) {
            width: 50%;
        }
    }
`;

const Left = styled.div`
    padding: 100px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const Right = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;

    @media (min-width: 768px) {
        background-color: ${colors.backgroundLightGrey};
    }
    @media (min-width: 900px) {
        padding: 60px;
    }
`;

const ConnectWalletButton = styled(Button)`
    margin-bottom: 60px;
`;

const Splitview: React.FC<SplitviewProps> = props => {
    const { leftComponent, rightComponent } = props;
    return (
        <SplitviewContainer>
            <Left>{leftComponent}</Left>
            <Right>{rightComponent}</Right>
        </SplitviewContainer>
    );
};

export const StakingWizard: React.FC<StakingWizardProps> = props => {
    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview
                    leftComponent={
                        <Timeline
                            activeItemIndex={0}
                            header="Start Staking"
                            description="Use one pool of capital across multiple relayers to trade against a large group."
                            items={[
                                {
                                    date: '22.08',
                                    fromNow: '2 days',
                                    title: 'Staking starts',
                                    description:
                                        'Your staking pool is included in the Market Maker score along with voting power.',
                                    isActive: true,
                                },
                                {
                                    date: '22.08',
                                    fromNow: '2 days',
                                    title: 'Staking starts',
                                    description:
                                        'Your staking pool is included in the Market Maker score along with voting power.',
                                    isActive: false,
                                },
                                {
                                    date: '22.08',
                                    fromNow: '2 days',
                                    title: 'Staking starts',
                                    description:
                                        'Your staking pool is included in the Market Maker score along with voting power.',
                                    isActive: false,
                                },
                            ]}
                        />
                    }
                    rightComponent={
                        <>
                            <NumberInput
                                placeholder="Enter your stake"
                                topLabel="Available: 1,000,000 ZRX"
                                bottomLabels={[
                                    {
                                        label: 'Based on your ZRX balance',
                                    },
                                    {
                                        label: 'Change wallet',
                                        link: '#',
                                        onClick: () => {
                                            // console.log('Change wallet');
                                        },
                                    },
                                ]}
                            />
                            <ConnectWalletButton color={colors.white}>
                                Connect your wallet to start staking
                            </ConnectWalletButton>
                            <Status
                                linkText="or explore market maker list"
                                linkUrl="/"
                                title="Please connect your wallet, so we can find suitable market maker."
                            />
                            <MarketMaker
                                name="Binance staking pool"
                                collectedFees="3.212,032 ETH"
                                rewards="95%"
                                staked="52%"
                                difference="+500,000 ZRX"
                            />
                            <Inner>
                                <TransactionItem
                                    marketMakerId="0x12345...12345"
                                    selfId="0x12345...12345"
                                    sendAmount="1520 ZRX"
                                    selfIcon="/images/toshi_logo.jpg"
                                    receiveAmount="1520 ZRX"
                                    marketMakerName="Binance"
                                    marketMakerIcon="/images/toshi_logo.jpg"
                                />
                                <TransactionItem
                                    marketMakerId="0x12345...12345"
                                    selfId="0x12345...12345"
                                    sendAmount="1520 ZRX"
                                    selfIcon="/images/toshi_logo.jpg"
                                    receiveAmount="1520 ZRX"
                                    marketMakerName="Binance"
                                    marketMakerIcon="/images/toshi_logo.jpg"
                                />
                            </Inner>
                        </>
                    }
                />
            </Container>
        </StakingPageLayout>
    );
};
