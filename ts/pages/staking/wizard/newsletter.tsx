import { logUtils } from '@0x/utils';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
// import { Icon } from 'ts/components/icon';
import { Input } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';

import { Inner } from 'ts/components/staking/wizard/inner';
import { CircleCheckMark } from 'ts/components/ui/circle_check_mark';

import { colors } from 'ts/style/colors';

import { WebsitePaths } from 'ts/types';

import { backendClient } from 'ts/utils/backend_client';
import { errorReporter } from 'ts/utils/error_reporter';

const StyledHeading = styled(Heading)`
    text-align: center;

    @media (max-width: 768px) {
        text-align: left;
    }
`;

const StyledParagraph = styled(Paragraph)`
    @media (min-width: 768px) {
        margin: ${props => !props.isNoMargin && '0 auto 60px auto'};
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

const CheckMarkWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 30px 0;
    @media (max-width: 768px) {
        display: none;
    }
`;

export const Newsletter = () => {
    const [email, setEmail] = React.useState<string>('');
    const [hasSubmitted, setHasSubmitted] = React.useState<boolean>(false);
    const onSubmit = React.useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!email) {
                return;
            }
            try {
                await backendClient.subscribeToNewsletterAsync(email.trim());
                setHasSubmitted(true);
            } catch (err) {
                logUtils.warn(`Unable to register email to newsletter`, email, err);
                errorReporter.report(err);
            }
        },
        [email],
    );

    return (
        <>
            <Inner>
                <StyledHeading size={34} marginBottom="15px" fontWeight="400">
                    {hasSubmitted ? 'Thank you!' : 'Congratulations!'}
                </StyledHeading>

                {hasSubmitted ? (
                    <>
                        <CheckMarkWrapper>
                            <CircleCheckMark width="72px" height="72px" />
                        </CheckMarkWrapper>
                        <StyledParagraph isCentered={true} isNoMargin={true}>
                            You have subscribed to our newsletter.
                        </StyledParagraph>
                    </>
                ) : (
                    <>
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
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your e-mail"
                            />

                            <Button isFullWidth={true} type="submit" color="#fff">
                                Subscribe
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
