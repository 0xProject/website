import * as React from 'react';
import styled from 'styled-components';
import { Heading, Paragraph } from 'ts/components/text';

import { Link } from '../documentation/shared/link';

const navData = [
    {
        title: '0x Docs',
        description: 'Learn and build with 0x',
        url: 'https://docs.0x.org/',
        shouldOpenInNewTab: true,
    },
];

export const DropdownDocs: React.FC = () => (
    <List>
        {navData.map((item, index) => (
            <li key={`productLink-${index}`}>
                <Link to={item.url} shouldOpenInNewTab={item.shouldOpenInNewTab}>
                    <Heading asElement="h3" color="inherit" isNoMargin={true} size="small">
                        {item.title}
                    </Heading>

                    {item.description && (
                        <Paragraph color="inherit" isNoMargin={true} size="small" isMuted={0.5}>
                            {item.description}
                        </Paragraph>
                    )}
                </Link>
            </li>
        ))}
    </List>
);

const List = styled.ul`
    a {
        padding: 15px 30px;
        display: block;
        color: inherit;
    }
`;
