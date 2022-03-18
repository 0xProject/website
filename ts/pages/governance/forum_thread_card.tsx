import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { Section } from 'ts/components/newLayout';
import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';

interface ForumThreadCardProps {
    title: string;
    author: string;
    numComments: number;
    url: string;
}

export function ForumThreadCard({ title, author, numComments, url }: ForumThreadCardProps): JSX.Element {
    return (
        <ReactRouterLink to={{ pathname: url }} target="_blank">
            <Section
                hasBorder={true}
                bgColor="none"
                padding="24px 35px"
                hasHover={true}
                margin="0"
                isFullWidth={true}
                wrapWidth="100%"
            >
                <ForumThreadHeading size="small" data-tip={title}>
                    {title}
                </ForumThreadHeading>
                <ReactTooltip />
                <MetaParagraph fontSize="17px" color={colors.textDarkSecondary}>
                    {`By ${author}  \u25CF  ${numComments} comments`}
                </MetaParagraph>
            </Section>
        </ReactRouterLink>
    );
}

const MetaParagraph = styled(Paragraph)`
    margin: 0 !important;
`;

const ForumThreadHeading = styled(Heading)`
    margin-bottom: 8px !important;
    line-height: 1.1rem !important;
    max-height: 1.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    -webkit-box-align: start !important;
`;
