import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Heading, Paragraph } from 'ts/components/text';
import { WebsitePaths } from 'ts/types';
import { constants } from 'ts/utils/constants';

const navData = [
    {
        title: '0x API',
        description: 'Single integration point to access all DEX liquidity',
        url: WebsitePaths.ZeroExApi,
    },
    {
        title: 'Matcha',
        description: 'Simple crypto trading for everyone',
        url: constants.MATCHA_PRODUCTION_URL,
        shouldOpenInNewTab: true,
    },
];

const DropdownLink: React.FC<{ href?: string; to?: string }> = ({ href, to, children }) =>
    href ? <a href={href}>{children}</a> : <Link to={to}>{children}</Link>;

export const DropdownProducts: React.FC = () => (
    <List>
        {navData.map((item, index) => (
            <li key={`productLink-${index}`}>
                <DropdownLink href={item.url} to={item.url}>
                    <Heading asElement="h3" color="inherit" isNoMargin={true} size="small">
                        {item.title}
                    </Heading>

                    {item.description && (
                        <Paragraph color="inherit" isNoMargin={true} size="small" isMuted={0.5}>
                            {item.description}
                        </Paragraph>
                    )}
                </DropdownLink>
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
