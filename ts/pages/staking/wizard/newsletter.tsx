import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Input } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';

import { Inner } from 'ts/components/staking/wizard/inner';

import { colors } from 'ts/style/colors';

import { WebsitePaths } from 'ts/types';

const StyledHeading = styled(Heading)`
    text-align: center;

    @media (max-width: 768px) {
        text-align: left;
    }
`;

const StyledParagraph = styled(Paragraph)`
    @media (min-width: 768px) {
        margin: 0 auto 60px auto;
        max-width: 340px;
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

        > *:last-child {
            margin-left: 15px;
        }
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
`;

export const Newsletter = () => {
    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        alert('submit!');
    };

    return (
        <>
            <Inner>
                <StyledHeading
                    size={34}
                    marginBottom="15px"
                    fontWeight="400"
                >
                    Congratulations!
                </StyledHeading>

                <StyledParagraph isCentered={true}>
                    Stay in the loop and know exactly what’s happening with your assets.
                </StyledParagraph>

                <FormWrap onSubmit={onSubmit}>
                    <Input
                        name="email"
                        label="Subscribe for updates"
                        type="email"
                        width="full"
                        placeholder="Enter your e-mail"
                    />

                    <Button isFullWidth={true} type="submit" color="#fff">
                        Subscribe
                    </Button>
                </FormWrap>
            </Inner>

            <ButtonWrap>
                <StyledButton
                    borderColor="#D94F3D"
                    bgColor={colors.white}
                    isFullWidth={true}
                >
                    <Icon name="google" size={24} />
                    Add dates to Gmail
                </StyledButton>
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
