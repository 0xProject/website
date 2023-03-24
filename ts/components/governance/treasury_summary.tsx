import marked, { Token, Tokens } from 'marked';
import React from 'react';
import styled from 'styled-components';

import { Heading, Paragraph } from 'ts/components/text';

export const TreasurySummary: React.FC<{ description: string }> = ({ description }) => {
    const tokens = marked.lexer(description);
    const heading = tokens.find(
        (token: Token) => (token as Tokens.Heading).type === 'heading' && (token as Tokens.Heading).depth === 1,
    );
    const paragraph = tokens.find((token: Token) => (token as Tokens.Paragraph).type === 'paragraph');
    let summary = '';
    // @ts-ignore
    if (paragraph?.tokens) paragraph.tokens.forEach((token) => {
        summary += token.text;
    });

    return (
        <>
            <Heading marginBottom="15px">{(heading as Tokens.Heading).text}</Heading>
            <TruncatedParagraph marginBottom="20px">{summary}</TruncatedParagraph>
        </>
    );
};

const TruncatedParagraph = styled(Paragraph)`
    line-height: 1.4rem !important;
    max-height: calc(1.4rem * n3);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    -webkit-box-align: start !important;
`;
