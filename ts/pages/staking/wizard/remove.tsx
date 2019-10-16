import * as React from 'react';
import styled from 'styled-components';

import { BigNumber } from '@0x/utils';

import { colors } from 'ts/style/colors';
import { utils } from 'ts/utils/utils';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';

import { Button } from 'ts/components/button';
import { Spinner } from 'ts/components/spinner';
import { InfoHeader, InfoHeaderItem } from 'ts/components/staking/wizard/info_header';
import { Inner } from 'ts/components/staking/wizard/inner';
import { NumberInput } from 'ts/components/staking/wizard/number_input';
import { Splitview } from 'ts/components/staking/wizard/splitview';
import { Timeline } from 'ts/components/staking/wizard/timeline';
import { TransactionItem } from 'ts/components/staking/wizard/transaction_item';

const STAKED = 1000000;

export interface StakingWizardProps {}

enum Steps {
    Initial,
    Confirm,
    WaitingForRemoval,
    WaitingForConfirmation,
    Done,
}

const Container = styled.div`
    max-width: 1390px;
    margin: 0 auto;
    position: relative;
`;

const CenteredHeader = styled.h2`
    max-width: 440px;
    margin: 0 auto;
    font-size: 34px;
    line-height: 1.23;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 175px;
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

const NumberInputContainer = styled.div`
    margin-bottom: 60px;
`;

const Message = styled.div`
    text-align: center;
    margin-top: 30px;
    margin-bottom: 130px;

    h2 {
        font-size: 34px;
        line-height: 1.24;
        width: 100%;
        margin-bottom: 15px;
    }

    p {
        font-size: 18px;
        line-height: 1.45;
        color: ${colors.textDarkSecondary};
        font-weight: 300;
        max-width: 340px;
        margin: 0 auto;
    }
`;

const ButtonsContainer = styled.div`
    display: flex;

    & > button {
        flex: 1;
        margin-right: 30px;

        &:last-child {
            margin-right: 0;
        }
    }
`;

const IntroHeader = styled.h1`
    font-size: 36px;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 15px;

    @media (min-width: 768px) {
        font-size: 50px;
    }
`;

const IntroDescription = styled.h2`
    font-size: 17px;
    font-weight: 300;
    color: ${colors.textDarkSecondary};
    line-height: 1.44;
    margin-bottom: 30px;
    max-width: 340px;

    @media (min-width: 768px) {
        margin-bottom: 60px;
        font-size: 18px;
    }
`;

interface Data {
    currency: string;
    amountStaked: BigNumber;
}

const getData = async (): Promise<Data> => {
    return new Promise<Data>((resolve, _reject) => {
        resolve({
            currency: 'ZRX',
            amountStaked: new BigNumber(1000000),
        });
    });
};

export const RemoveStake: React.FC<StakingWizardProps> = props => {
    const [step, setStep] = React.useState<Steps>(Steps.Initial);
    const [value, setValue] = React.useState<null | string>(null);
    const [parsedValue, setParsedValue] = React.useState<null | number>(null);
    const [isError, setIsError] = React.useState<boolean>(false);
    const [data, setData] = React.useState<Data>({
        currency: 'ZRX',
        amountStaked: new BigNumber(0),
    });

    const isStepWaiting = step === Steps.Confirm ||
        step === Steps.WaitingForConfirmation ||
        step === Steps.WaitingForRemoval;

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

    const onButtonClick = async (): Promise<void> => {
        if (isError) {
            return;
        }

        await startWizard();
    };

    // This is purely to emulate a 'slow' API response from the server,
    // can be removed after the real data handling gets implemented.
    const emulateApiRequest = async () => {
        return new Promise<void>(resolve => setTimeout(resolve, 1500));
    };

    const startWizard = async () => {
        setStep(Steps.Confirm);

        await emulateApiRequest();

        setStep(Steps.WaitingForRemoval);

        await emulateApiRequest();

        setStep(Steps.WaitingForConfirmation);

        await emulateApiRequest();

        setStep(Steps.Done);
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
                        <>
                            <IntroHeader>Start staking your tokens</IntroHeader>
                            <IntroDescription>Use one pool of capital across multiple relayers to trade against a large group.</IntroDescription>
                            <Timeline
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
                            />
                        </>
                    }
                    rightComponent={
                        <>
                            <InfoHeader>
                                <InfoHeaderItem>
                                    Remove Stake
                                </InfoHeaderItem>

                                {data != null && data.amountStaked != null && (
                                    <InfoHeaderItem>
                                        Total Staked: {utils.getFormattedAmount(data.amountStaked, 0)}
                                    </InfoHeaderItem>
                                )}
                            </InfoHeader>
                            <Inner>
                                {isStepWaiting &&
                                    <CenteredHeader>
                                        {step === Steps.Confirm && 'Please confirm in Metamask'}
                                        {step === Steps.WaitingForRemoval && 'Removing your stake'}
                                        {step === Steps.WaitingForConfirmation && 'Receiving final confirmation'}
                                    </CenteredHeader>
                                }

                                {step === Steps.Initial &&
                                    <NumberInputContainer>
                                        <NumberInput
                                            placeholder="Amount removed"
                                            heading="Amount"
                                            value={value}
                                            onChange={newValue => onValueChange(newValue.target.value)}
                                            isError={isError}
                                            shouldFocusOnInit={true}
                                        />
                                    </NumberInputContainer>
                                }

                                {step !== Steps.Done &&
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
                                }

                                {step === Steps.Initial && (
                                    <Button
                                        bgColor={colors.orange}
                                        color={colors.white}
                                        isFullWidth={true}
                                        onClick={onButtonClick}
                                        isDisabled={isError}
                                    >
                                        Remove stake
                                    </Button>
                                )}

                                {isStepWaiting &&
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
                                }

                                {step === Steps.Done &&
                                    <>
                                        <Message>
                                            <h2>Congratulations!</h2>
                                            <p>You have initiated a removal of your stake. You can already choose another market maker or withdraw your funds after this epoch.</p>
                                        </Message>
                                        <ButtonsContainer>
                                            <Button isInline={true} isTransparent={true} borderColor={colors.brandLight}>Go to dashboard</Button>
                                            <Button isInline={true} color={colors.white}>Choose new pool</Button>
                                        </ButtonsContainer>
                                    </>
                                }
                            </Inner>
                        </>
                    }
                />
            </Container>
        </StakingPageLayout>
    );
};
