import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Button } from 'ts/components/button';
import { Spinner } from 'ts/components/spinner';
import { MarketMaker } from 'ts/components/staking/wizard/MarketMaker';
import { NumberInput } from 'ts/components/staking/wizard/NumberInput';
import { Splitview } from 'ts/components/staking/wizard/splitview';
import { Status } from 'ts/components/staking/wizard/Status';
// import { Timeline } from 'ts/components/staking/wizard/timeline';
import { TransactionItem } from 'ts/components/staking/wizard/TransactionItem';

export interface StakingWizardProps {}

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

const IntroHeader = styled.h1`
    font-size: 36px;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 15px;
    text-align: center;

    @media (min-width: 480px) {
        text-align: left;
    }

    @media (min-width: 768px) {
        font-size: 50px;
    }
`;

const IntroDescription = styled.h2`
    font-size: 18px;
    font-weight: 300;
    color: ${colors.textDarkSecondary};
    line-height: 1.44;
    margin-bottom: 30px;
    text-align: center;

    @media (min-width: 480px) {
        max-width: 340px;
        text-align: left;
    }

    @media (min-width: 768px) {
        margin-bottom: 60px;
    }
`;

const IntroMetrics = styled.ul`
    display: block;
    padding-top: 30px;
    position: relative;

    @media (min-width: 480px) {
        padding-top: 60px;

        &:before {
            position: absolute;
            height: 1px;
            width: 100%;
            max-width: 340px;
            background-color: #E3E3E3;
            top: 0;
            left: 0;
            content: '';
        }
    }
`;

const IntroMetric = styled.li`
    display: block;
    text-align: center;
    margin-bottom: 15px;

    @media (min-width: 480px) {
        text-align: left;
        display: inline-block;
        width: 50%;
    }

    h2 {
        font-size: 28px;
        line-height: 1.35;
        margin-bottom: 7px;

        @media (min-width: 480px) {
            font-size: 34px;
            line-height: 1.23;
            margin-bottom: 15px;
        }
    }

    p {
        font-size: 17px;
        line-height: 1.44;
        font-weight: 300;
        color: ${colors.textDarkSecondary};

        @media (min-width: 480px) {
            font-size: 18px;
        }
    }
`;

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
                        <>
                            <IntroHeader>Start staking your tokens</IntroHeader>
                            <IntroDescription>Use one pool of capital across multiple relayers to trade against a large group.</IntroDescription>

                            <IntroMetrics>
                                <IntroMetric>
                                    <h2>873,435</h2>
                                    <p>Rewards collected</p>
                                </IntroMetric>
                                <IntroMetric>
                                    <h2>$203M</h2>
                                    <p>Total stake</p>
                                </IntroMetric>
                            </IntroMetrics>

                            {/* <Timeline
                                activeItemIndex={0}
                                items={[
                                    {
                                        date: '22.08',
                                        fromNow: '2 days',
                                        title: 'Removing your stake',
                                        description: 'Your declared staking pool is going to be locked in smart contract.',
                                        isActive: true,
                                    },
                                    {
                                        date: '22.08',
                                        fromNow: '2 days',
                                        title: 'Lockout period',
                                        description:
                                            'Your tokens will be locked from withdrawal until the end of the next Epoch.',
                                        isActive: false,
                                    },
                                    {
                                        date: '22.08',
                                        fromNow: '2 days',
                                        title: 'Tokens unlocked',
                                        description:
                                            'You are able to withdraw your tokens to your wallet, which you are free to move or restake',
                                        isActive: false,
                                    },
                                ]}
                            /> */}
                        </>
                    }
                    rightComponent={
                        <>
                            <NumberInput
                                placeholder="Enter your stake"
                                heading="Amount"
                                topLabels={['Amount', 'Available: 1,000,000 ZRX']}
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
