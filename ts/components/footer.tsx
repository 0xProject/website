import * as React from 'react';
import styled from 'styled-components';

import { Link as SmartLink } from 'ts/components/documentation/shared/link';
import { Logo } from 'ts/components/logo';
import { Column, FlexWrap } from 'ts/components/newLayout';

import { colors } from 'ts/style/colors';

interface LinkInterface {
    text: string;
    url: string;
    shouldOpenInNewTab?: boolean;
}

interface LinkListProps {
    links: LinkInterface[];
}

interface IFooterProps {
    isDocs?: boolean;
    shouldShowDisclaimer?: boolean;
}

export const Footer: React.FC<IFooterProps> = React.memo(({ isDocs, shouldShowDisclaimer }) => (
    <FooterWrap isDocs={isDocs}>
        <FlexWrap>
            <FooterColumn width="35%">
                <Logo />
            </FooterColumn>

            <FooterColumn width="55%">
                <LinkCollection>
                    <Link to="https://0x.org/legal/privacy-notice" shouldOpenInNewTab={true}>
                        Privacy Notice
                    </Link>
                    <Link to="https://0x.org/legal/cookie-notice" shouldOpenInNewTab={true}>
                        Cookie Notice
                    </Link>
                </LinkCollection>
                {/* <WrapGrid isCentered={false} isWrapped={true}>
                    {linkRows.map((row: LinkRows, index) => (
                        <MediaQuery minWidth={row.isOnMobile ? 0 : 768} key={`fc-${index}`}>
                            <FooterSectionWrap>
                                <RowHeading>{row.heading}</RowHeading>

                                <LinkList links={row.links} />
                            </FooterSectionWrap>
                        </MediaQuery>
                    ))}
                </WrapGrid> */}
            </FooterColumn>
        </FlexWrap>
        {shouldShowDisclaimer && (
            <FlexWrap>
                <Text>We provide downloadable software and software services.</Text>
            </FlexWrap>
        )}
    </FooterWrap>
));

const LinkList = (props: LinkListProps) => (
    <List>
        {props.links.map((link, index) => (
            <li key={`fl-${index}`}>
                <Link to={link.url} shouldOpenInNewTab={link.shouldOpenInNewTab}>
                    {link.text}
                </Link>
            </li>
        ))}
    </List>
);

const LinkCollection = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 25px;
`;

const FooterWrap = styled.footer<IFooterProps>`
    padding: 40px 30px 30px 30px;
    margin-top: 30px;
    background-color: ${(props) => (props.isDocs ? colors.backgroundLight : props.theme.footerBg)};
    color: ${(props) => props.theme.footerColor};

    path {
        fill: ${(props) => props.theme.footerColor};
    }

    @media (min-width: 768px) {
        min-height: 100px;
    }
`;

const FooterColumn = styled(Column)`
    @media (min-width: 768px) {
        width: ${(props) => props.width};
    }

    @media (max-width: 768px) {
        text-align: left;
    }
`;

const List = styled.ul`
    li + li {
        margin-top: 8px;
    }
`;

const Link = styled(SmartLink)`
    color: inherit;
    opacity: 0.5;
    display: block;
    font-size: 16px;
    line-height: 20px;
    transition: opacity 0.25s;
    text-decoration: none;

    &:hover {
        opacity: 0.8;
    }
`;

const Text = styled.p`
    color: #656565;
    font-size: 0.833333333rem;
    font-weight: 300;
    line-height: 1.2em;
    margin-top: 15px;
`;
