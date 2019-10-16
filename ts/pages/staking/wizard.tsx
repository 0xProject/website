import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Button } from 'ts/components/button';
import { Spinner } from 'ts/components/spinner';
import { MarketMaker } from 'ts/components/staking/wizard/market_maker';
import { NumberInput } from 'ts/components/staking/wizard/number_input';
import { Status } from 'ts/components/staking/wizard/status';
import { Timeline } from 'ts/components/staking/wizard/timeline';
import { TransactionItem } from 'ts/components/staking/wizard/transaction_item';

export interface StakingWizardProps {}

interface SplitviewProps {
    leftComponent: React.ReactNode;
    rightComponent: React.ReactNode;
}

interface ErrorButtonProps {
    message: string;
    secondaryButtonText: string;
    onClose: () => void;
    onSecondaryClick: () => void;
}

const Container = styled.div`
    max-width: 1390px;
    margin: 0 auto;
    position: relative;
`;

const Inner = styled.div`
    border: 1px solid #e3e3e3;
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

const ButtonWithIcon = styled(Button)`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const SpinnerContainer = styled.span`
    display: inline-block;
    margin-right: 10px;
`;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
`;

const InfoHeaderItem = styled.span`
    font-size: 20px;
    line-height: 1.35;

    &:last-child {
        color: ${colors.textDarkSecondary};
    }
`;

const ErrorButtonContainer = styled.div`
    padding: 18px 0;
    font-size: 18px;
    color: ${colors.error};
    border: 1px solid ${colors.error};
    display: flex;
    align-items: center;
    width: 100%;

    span {
        flex: 1;
    }
`;

const CloseIcon = styled(Icon)`
    path {
        fill: ${colors.error};
    }
`;

const CloseIconContainer = styled.button`
    text-align: center;
    flex: 0 0 60px;
    border: 0;
`;

const Retry = styled.button`
    max-width: 100px;
    flex: 1 1 100px;
    border: 0;
    font-size: 18px;
    font-family: 'Formular', monospace;
    border-left: 1px solid #898989;
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

const ErrorButton: React.FC<ErrorButtonProps> = props => {
    const { onSecondaryClick, message, secondaryButtonText } = props;
    return (
        <ErrorButtonContainer>
            <CloseIconContainer>
                <CloseIcon name="close" size={10} />
            </CloseIconContainer>
            <span>{message}</span>
            <Retry onClick={onSecondaryClick}>{secondaryButtonText}</Retry>
        </ErrorButtonContainer>
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
                                topLabels={['Available: 1,000,000 ZRX']}
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
                                iconUrl="/images/toshi_logo.jpg"
                            />
                            <InfoHeader>
                                <InfoHeaderItem>Start Staking</InfoHeaderItem>
                                <InfoHeaderItem>Begins in 2 days</InfoHeaderItem>
                            </InfoHeader>
                            <Inner>
                                <TransactionItem
                                    marketMakerId="0x12345...12345"
                                    selfId="0x12345...12345"
                                    sendAmount="1520 ZRX"
                                    selfIconUrl="/images/toshi_logo.jpg"
                                    receiveAmount="1520 ZRX"
                                    marketMakerName="Binance"
                                    marketMakerIconUrl="/images/toshi_logo.jpg"
                                    isActive={true}
                                />
                                <TransactionItem
                                    marketMakerId="0x12345...12345"
                                    selfId="0x12345...12345"
                                    sendAmount="1520 ZRX"
                                    selfIconUrl="/images/toshi_logo.jpg"
                                    receiveAmount="1520 ZRX"
                                    marketMakerName="Binance"
                                    marketMakerIconUrl="/images/toshi_logo.jpg"
                                    isActive={false}
                                />
                                <ButtonWithIcon
                                    isTransparent={true}
                                    borderColor="#DFE7E1"
                                    color={colors.textDarkSecondary}
                                    isDisabled={true}
                                >
                                    <SpinnerContainer>
                                        <Spinner color="#BEBEBE" />
                                    </SpinnerContainer>
                                    <span>Waiting for signature</span>
                                </ButtonWithIcon>

                                <ErrorButton
                                    message="Transaction aborted"
                                    secondaryButtonText="Retry"
                                    onClose={() => {
                                        alert('close');
                                    }}
                                    onSecondaryClick={() => {
                                        alert('close');
                                    }}
                                />
                            </Inner>
                        </>
                    }
                />
            </Container>
        </StakingPageLayout>
    );
};
