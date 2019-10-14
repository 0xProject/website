import * as React from 'react';
import styled from 'styled-components';

import { BigNumber } from '@0x/utils';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';
import { utils } from 'ts/utils/utils';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Button } from 'ts/components/button';
import { Spinner } from 'ts/components/spinner';
import { MarketMaker } from 'ts/components/staking/wizard/MarketMaker';
import { NumberInput } from 'ts/components/staking/wizard/NumberInput';
import { Splitview } from 'ts/components/staking/wizard/splitview';
import { Status } from 'ts/components/staking/wizard/Status';
import { Timeline } from 'ts/components/staking/wizard/Timeline';
import { TransactionItem } from 'ts/components/staking/wizard/TransactionItem';

const STAKED = 1000000;

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

interface Data {
    currency: string;
    amountStaked: BigNumber;
}

const getData = async (): Promise<Data> => {
    return new Promise((resolve, _reject) => {
        resolve({
            currency: 'ZRX',
            amountStaked: new BigNumber(1000000),
        });
    });
};

export const RemoveStake: React.FC<StakingWizardProps> = props => {
    const [step, setStep] = React.useState<number>(0);
    const [value, setValue] = React.useState<null | string>(null);
    const [parsedValue, setParsedValue] = React.useState<null | number>(null);
    const [isError, setIsError] = React.useState<boolean>(false);
    const [data, setData] = React.useState<Data>({
        currency: 'ZRX',
        amountStaked: new BigNumber(0),
    });

    const onValueChange = (newValue: string): void => {
        const parsed = parseInt(newValue, 0);

        setValue(newValue);

        if (parsed > STAKED || isNaN(parsed)) {
            setIsError(true);
            return;
        }

        if (isError && parsed <= STAKED) {
            setIsError(false);
        }

        setParsedValue(parsed);
    };

    const onButtonClick = (): void => {
        if (isError) {
            return;
        }

        setStep(oldStep => oldStep + 1);
    };

    React.useEffect(() => {
        getData()
            .then(setData)
            .catch();
    }, []);

    return (
        <StakingPageLayout isHome={false} title="Remove stake">
            <Container>
                <Splitview
                    leftComponent={
                        <Timeline
                            activeItemIndex={0}
                            header="Unstake your ZRX"
                            description="Use one pool of capital across multiple relayers to trade against a large group."
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
                        />
                    }
                    rightComponent={
                        <>
                            <InfoHeader>
                                <InfoHeaderItem>Remove stake</InfoHeaderItem>
                                {data != null && data.amountStaked != null && (
                                    <InfoHeaderItem>
                                        Total Staked: {utils.getFormattedAmount(data.amountStaked, 0)}
                                    </InfoHeaderItem>
                                )}
                            </InfoHeader>
                            <Inner>

                                <NumberInput
                                    placeholder="Enter your stake"
                                    heading="Amount"
                                    value={value}
                                    onChange={newValue => onValueChange(newValue.target.value)}
                                    isError={isError}
                                    shouldFocusOnInit={true}
                                />

                                <TransactionItem
                                    marketMakerId="0x12345...12345"
                                    selfId="0x12345...12345"
                                    sendAmount={parsedValue != null ? `${parsedValue} ${data.currency}` : ''}
                                    selfIconUrl="/images/toshi_logo.jpg"
                                    receiveAmount="Transfer Scheduled for 24.08"
                                    marketMakerName="Binance"
                                    marketMakerIconUrl="/images/toshi_logo.jpg"
                                    isActive={true}
                                />

                                <Button
                                    bgColor={colors.orange}
                                    color={colors.white}
                                    isFullWidth={true}
                                    onClick={onButtonClick}
                                    isDisabled={isError}
                                >
                                    Remove stake
                                </Button>
                            </Inner>
                        </>
                    }
                />
            </Container>
        </StakingPageLayout>
    );
};
