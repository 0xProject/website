import * as React from 'react';
import styled from 'styled-components';
import { Heading, Paragraph } from 'ts/components/text';
import { WebsitePaths } from 'ts/types';
import { constants } from 'ts/utils/constants';

import { Link } from '../documentation/shared/link';

const navData = [
    {
        title: '0x Docs',
        description: 'Single integration point to access all DEX liquidity',
        url: WebsitePaths.Docs,
    },
    {
        title: '0x Docs - Alpha Release',
        description: 'Learn about 0x core concepts from our updated documentation ',
        url: 'https://docs.0x.org/',
        shouldOpenInNewTab: true,
    },
];

export const DropdownProducts: React.FC = () => (
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
