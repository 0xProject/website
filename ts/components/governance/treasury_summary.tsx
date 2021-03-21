import marked, { Token, Tokens } from 'marked';
import React from 'react';

import { Heading, Paragraph } from 'ts/components/text';

export const TreasurySummary: React.FC<{ description: string }> = ({ description }) => {
    const tokens = marked.lexer(description);
    const heading = tokens.find(
        (token: Token) => (token as Tokens.Heading).type === 'heading' && (token as Tokens.Heading).depth === 1,
    );
    const paragraph = tokens.find((token: Token) => (token as Tokens.Paragraph).type === 'paragraph');
    let summary = '';
    // @ts-ignore
    paragraph.tokens.forEach((token) => {
        summary += token.text;
    });

    return (
        <>
            <Heading marginBottom="15px">{(heading as Tokens.Heading).text}</Heading>
            <Paragraph marginBottom="20px">{summary}</Paragraph>
        </>
    );
};
