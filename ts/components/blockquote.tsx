import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Paragraph } from 'ts/components/text';
import QuotesLeft from 'ts/icons/illustrations/quotesLeft.svg';
import { colors } from 'ts/style/colors';

interface BlockquoteProps {
    citeUrl?: string;
    citeLabel?: string;
}

export const Blockquote: React.FC<BlockquoteProps> = ({ citeUrl, citeLabel, children }) => {
    const label = `-${citeLabel}`;

    return (
        <Wrap>
            <blockquote cite={citeUrl}>
                <Paragraph size="medium" marginBottom="0">
                    {children}
                </Paragraph>
            </blockquote>

            {citeLabel && (
                <Caption>
                    {citeUrl ? (
                        <Button
                            borderColor="transparent"
                            fontSize="var(--smallHeading)"
                            href={citeUrl}
                            isTransparent={true}
                            isInline={true}
                            isNoBorder={true}
                            isNoPadding={true}
                            target="_blank"
                        >
                            {label}
                        </Button>
                    ) : (
                        { label }
                    )}
                </Caption>
            )}
            <StyledIcon />
        </Wrap>
    );
};

const Wrap = styled.figure`
    position: relative;

    margin: 0 20px;
    padding: 40px 40px 28px;
    border: 1px solid ${colors.brandLight};

    @media (min-width: 768px) {
        margin: 0;
        padding: 60px 60px 48px;
    }
`;

const Caption = styled.figcaption`
    margin-top: 4px;
    font-size: var(--smallHeading);
    line-height: var(--smallHeadingHeight);
    text-align: right;
`;

const StyledIcon = styled(QuotesLeft)`
    position: absolute;
    top: -34px;
    left: -16px;
`;
