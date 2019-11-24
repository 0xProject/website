import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';
import { AccountState, Network, ProviderState, WebsitePaths } from 'ts/types';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Button } from 'ts/components/button';
import { Spinner } from 'ts/components/spinner';
import { Inner } from 'ts/components/staking/wizard/inner';
import { MarketMaker } from 'ts/components/staking/wizard/market_maker';
import { NumberInput } from 'ts/components/staking/wizard/number_input';
import { Splitview } from 'ts/components/staking/wizard/splitview';
import { Status } from 'ts/components/staking/wizard/status';
// import { Timeline } from 'ts/components/staking/wizard/timeline';
import { TransactionItem } from 'ts/components/staking/wizard/transaction_item';

import { Newsletter } from 'ts/pages/staking/wizard/newsletter';

export interface StakingWizardProps {
    providerState: ProviderState;
    networkId: Network;
    onOpenConnectWalletDialog: () => void;
    onDepositAndStartStakingAsync: (
        providerState: ProviderState,
        networkId: Network,
        amountToStakeInput: string,
    ) => Promise<void>;
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
    align-items: flex-start;
    flex-direction: column;

    @media (min-width: 480px) {
        flex-direction: row;
    }

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
    }

    @media (min-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 1140px) {
        flex-direction: row;
        align-items: center;
    }
`;

const InfoHeaderItem = styled.span`
    font-size: 18px;
    line-height: 1.35;

    @media (min-width: 480px) {
        font-size: 20px;
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

const NumberRound = styled.span`
    background-color: ${colors.white};
    border-radius: 50%;
    width: 34px;
    height: 34px;
    display: inline-block;
    text-align: center;
    padding: 4px 0;
    border: 1px solid #f6f6f6;
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
            background-color: #e3e3e3;
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

export interface StakingWizardHeaderProps {
    title: string;
    description: string;
}

const StakingWizardHeader: React.FC<StakingWizardHeaderProps> = ({ title, description }) => (
    <>
        <IntroHeader>{title}</IntroHeader>
        <IntroDescription>{description}</IntroDescription>
    </>
);

const getLeftComponent = (): React.ReactNode => {
    /* <Timeline
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
    /> */

    /* <MarketMaker
            name="Binance staking pool"
            collectedFees="3.212,032 ETH"
            rewards="95%"
            staked="52%"
            difference="+500,000 ZRX"
            iconUrl="/images/toshi_logo.jpg"
        />
        <InfoHeader>
            <InfoHeaderItem>
                Recommended market makers <NumberRound>2</NumberRound>
            </InfoHeaderItem>
            <InfoHeaderItem>
                <Button isWithArrow={true} color={colors.textDarkSecondary}>
                    Full list
                </Button>
            </InfoHeaderItem>
        </InfoHeader>

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
        <Newsletter /> */
    return (
        <>
            <StakingWizardHeader
                title="Start staking your tokens"
                description="Use one pool of capital across multiple relayers to trade against a large group."
            />
            <IntroMetrics>
                <IntroMetric>
                    <h2>873,435 ETH</h2>
                    <p>Total rewards collected</p>
                </IntroMetric>
                <IntroMetric>
                    <h2>203,000 ZRX</h2>
                    <p>Total ZRX Staked</p>
                </IntroMetric>
            </IntroMetrics>
        </>
    );
};

const getRightComponent = (props: StakingWizardProps): React.ReactNode => {
    if (props.providerState.account.state !== AccountState.Ready) {
        return (
            <>
                <ConnectWalletButton color={colors.white} onClick={props.onOpenConnectWalletDialog}>
                    Connect your wallet to start staking
                </ConnectWalletButton>
                <Status
                    title="Please connect your wallet, so we can find suitable market maker."
                    linkText="or explore market maker list"
                    to={WebsitePaths.Staking}
                />
            </>
        );
    }
    const { zrxBalanceBaseUnitAmount } = props.providerState.account;
    if (!zrxBalanceBaseUnitAmount) {
        // Fetching balance
        return <Status title="" />;
    }
    if (!zrxBalanceBaseUnitAmount.gt(0)) {
        return (
            <Status
                title="You have no ZRX balance. You will need some to stake."
                linkText="Go buy some ZRX"
                linkUrl={`https://www.rexrelay.com/instant/?defaultSelectedAssetData=${constants.ZRX_ASSET_DATA}`}
            />
        );
    }

    const [selectedLabel, setSelectedLabel] = React.useState<string | undefined>(undefined);
    const [stakingAmount, setStakingAmount] = React.useState<string>('');

    const formattedBalance = utils.getFormattedAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);

    return (
        <>
            <NumberInput
                placeholder="Enter your stake"
                heading="Amount"
                value={stakingAmount}
                topLabels={['Amount', `Available: ${formattedBalance} ZRX`]}
                labels={['25%', '50%', '100%']}
                selectedLabel={selectedLabel}
                onChange={e => {
                    setStakingAmount(e.target.value);
                    setSelectedLabel(undefined);
                }}
                onLabelChange={(label: string) => {
                    let divisor = 1;
                    if (label === '50%') {
                        divisor = 2;
                    } else if (label === '25%') {
                        divisor = 4;
                    }

                    const amount = zrxBalanceBaseUnitAmount
                        .dividedBy(constants.ZRX_BASE_UNIT)
                        .dividedBy(divisor)
                        .decimalPlaces(2, BigNumber.ROUND_DOWN);

                    setStakingAmount(amount.toString());
                    setSelectedLabel(label);
                }}
                bottomLabels={[
                    {
                        label: 'Based on your ZRX balance',
                    },
                    {
                        label: 'Change wallet',
                        onClick: props.onOpenConnectWalletDialog,
                    },
                ]}
            />
            <Status
                title="Please select an amount of staked ZRX above to see matching Staking Pool."
                linkText="or explore market maker list"
                to={WebsitePaths.Staking}
            />
        </>
    );
};

export const StakingWizard: React.FC<StakingWizardProps> = props => {
    const leftComponent = getLeftComponent();
    const rightComponent = getRightComponent(props);
    return (
        <StakingPageLayout isHome={false} title="Start Staking">
            <Container>
                <Splitview leftComponent={leftComponent} rightComponent={rightComponent} />
            </Container>
        </StakingPageLayout>
    );
};
