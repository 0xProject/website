import { logUtils } from '@0x/utils';
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
// import { Icon } from 'ts/components/icon';
import { Input } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';

import { Inner } from 'ts/components/staking/wizard/inner';

import { colors } from 'ts/style/colors';

import { WebsitePaths } from 'ts/types';

import { backendClient } from 'ts/utils/backend_client';
import { configs } from 'ts/utils/configs.ts';
import { errorReporter } from 'ts/utils/error_reporter';

const StyledHeading = styled(Heading)`
    text-align: center;

    @media (max-width: 768px) {
        text-align: left;
    }
`;

const StyledParagraph = styled(Paragraph)`
    @media (min-width: 768px) {
        margin: 0 auto 60px auto;
    }

    @media (max-width: 768px) {
        text-align: left;
    }
`;

const FormWrap = styled.form`
    button {
        margin-top: 15px;
    }

    @media (max-width: 768px) {
        > div {
            margin-bottom: 10px;
        }
    }
`;

const ButtonWrap = styled.div`
    display: flex;
    justify-content: space-between;

    @media (min-width: 768px) {
        margin-top: 15px;
    }

    @media (max-width: 768px) {
        margin-top: 10px;

        > *:last-child {
            margin-top: 10px;
        }

        > *:first-child {
            display: none;
        }
    }
`;

// TODO(johnrjj) - There's a problem with Button & links re: styles. It reverses generated classnames
// e.g. without the !important, StyledButton as a Link won't have display:flex,
// but will inherit the original display:inline-block
const StyledButton = styled(Button)`
    display: flex !important;
    justify-content: center;
    align-items: center;

    figure {
        margin-right: 10px;
    }

    @media (min-width: 768px) {
        & + & {
            margin-left: 15px;
        }
    }
`;

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 30px 0;
    @media (max-width: 768px) {
        display: none;
    }
`;

const CircleThumbsUp = () => (
    <svg width="143" height="144" viewBox="0 0 143 144" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M71.5 141.54C110.16 141.54 141.5 110.2 141.5 71.5399C141.5 32.88 110.16 1.53992 71.5 1.53992C32.8401 1.53992 1.5 32.88 1.5 71.5399C1.5 110.2 32.8401 141.54 71.5 141.54Z"
            stroke="#00AE99"
            strokeWidth="3"
            strokeMiterlimit="10"
        />
        <path
            d="M62.1811 102.79H42.75V54.2092H62.1811M62.1811 102.79V54.2092M62.1811 102.79V98.3286H105.25V87.81M62.1811 54.2092V34.0399H74.4495V58.4334H105.25V67.8624M105.25 78.381H93.9353M105.25 78.381V67.8624M105.25 78.381V87.81M105.25 67.8624H93.9353M105.25 87.81H93.9353"
            stroke="#00AE99"
            strokeWidth="3"
            strokeMiterlimit="10"
        />
    </svg>
);

export const Newsletter = () => {
    const { account } = useWeb3React();
    const ethAddress = account;

    const [email, setEmail] = React.useState<string>('');
    const [hasSubmitted, setHasSubmitted] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const onSubmit = React.useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!email) {
                return;
            }
            try {
                setIsLoading(true);
                await backendClient.subscribeToNewsletterAsync({
                    email,
                    subscriberInfo: { ETHADDRESS: ethAddress },
                    list: configs.STAKING_UPDATES_NEWSLETTER_ID,
                });
                setHasSubmitted(true);
            } catch (err) {
                logUtils.warn(`Unable to register email to newsletter`, email, err);
                errorReporter.report(err);
            }
            setIsLoading(false);
        },
        [email, ethAddress],
    );

    return (
        <>
            <Inner>
                {hasSubmitted ? (
                    <>
                        <IconWrapper>
                            <CircleThumbsUp />
                        </IconWrapper>
                        <StyledHeading size={34} marginBottom="15px" fontWeight="400">
                            Subscribed!
                        </StyledHeading>
                        <StyledParagraph isCentered={true}>
                            We will send you emails when
                            <br />
                            you start receiving rewards
                        </StyledParagraph>
                    </>
                ) : (
                    <>
                        <StyledHeading size={34} marginBottom="15px" fontWeight="400">
                            Congratulations!
                        </StyledHeading>
                        <StyledParagraph isCentered={true}>
                            Stay in the loop and know exactly what’s
                            <br />
                            happening with your assets.
                        </StyledParagraph>
                        <FormWrap onSubmit={onSubmit}>
                            <Input
                                name="email"
                                label="Subscribe for updates"
                                type="email"
                                value={email}
                                width="full"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your e-mail"
                            />

                            <Button isDisabled={isLoading} isFullWidth={true} type="submit" color="#fff">
                                {isLoading ? 'Loading...' : 'Subscribe'}
                            </Button>
                        </FormWrap>
                    </>
                )}
            </Inner>

            <ButtonWrap>
                {/* TODO(kimpers): Add this back when we have some time }
                <StyledButton borderColor="#D94F3D" bgColor={colors.white} isFullWidth={true}>
                    <Icon name="google" size={24} />
                    Add dates to Gmail
                </StyledButton>
                */}
                <StyledButton
                    to={WebsitePaths.Staking}
                    bgColor={colors.white}
                    borderColor={colors.brandLight}
                    isFullWidth={true}
                >
                    Go to dashboard
                </StyledButton>
            </ButtonWrap>
        </>
    );
};
