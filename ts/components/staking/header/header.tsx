import React, { useCallback, useEffect, useState } from 'react';
import Headroom from 'react-headroom';
import { useDispatch } from 'react-redux';
import MediaQuery from 'react-responsive';
import styled, { css } from 'styled-components';
import { useWeb3React } from '@web3-react/core';

import { MobileNav } from 'ts/components/docs/header/mobile_nav';
import { Link } from 'ts/components/documentation/shared/link';
import { Hamburger } from 'ts/components/hamburger';
import { Logo } from 'ts/components/logo';
import { FlexWrap } from 'ts/components/newLayout';
import { SubMenu } from 'ts/components/staking/header/sub_menu';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { ThemeValuesInterface } from 'ts/style/theme';
import { zIndex } from 'ts/style/z_index';
import { AccountState, WebsitePaths } from 'ts/types';

import { colors } from 'ts/style/colors';

interface HeaderProps {
    location?: Location;
    isNavToggled?: boolean;
    toggleMobileNav?: () => void;
}

interface NavLinkProps {
    link: NavItems;
    key: string;
}

interface NavItems {
    url?: string;
    id?: string;
    text?: string;
}

const navItems: NavItems[] = [
    {
        id: 'staking',
        text: 'Staking',
        url: WebsitePaths.Staking,
    },
    {
        id: 'governance',
        text: 'Governance',
        url: WebsitePaths.Vote,
    },
    {
        id: 'your-account',
        text: 'Your Account',
        url: WebsitePaths.Account,
    },
];

export const Header: React.FC<HeaderProps> = ({ isNavToggled, toggleMobileNav }) => {
    const { deactivate, active, account, connector } = useWeb3React();

    const dispatch = useDispatch();
    const [dispatcher, setDispatcher] = useState<Dispatcher | undefined>(undefined);

    useEffect(() => {
        setDispatcher(new Dispatcher(dispatch));
    }, [dispatch]);

    const onUnpin = useCallback(() => {
        if (isNavToggled) {
            toggleMobileNav();
        }
    }, [isNavToggled, toggleMobileNav]);

    const unpinAndOpenWalletDialog = useCallback(() => {
        onUnpin();
        dispatcher.updateIsConnectWalletDialogOpen(true);
    }, [dispatcher, onUnpin]);

    const subMenu = (
        <SubMenu
            openConnectWalletDialogCB={unpinAndOpenWalletDialog}
            deactivate={deactivate}
            account={account}
            active={active}
            connector={connector}
        />
    );

    return (
        <Headroom
            onUnpin={onUnpin}
            downTolerance={4}
            upTolerance={10}
            wrapperStyle={{ position: 'relative', zIndex: 2 }}
        >
            <StyledHeader isNavToggled={isNavToggled}>
                <HeaderWrap>
                    <LogoWrap>
                        <Link to={WebsitePaths.Home}>
                            <Logo />
                        </Link>
                        <DocsLogoWrap>
                            / <DocsLogoLink to={WebsitePaths.Staking}>ZRX</DocsLogoLink>
                        </DocsLogoWrap>
                        <BetaTagContainer>
                            <BetaTag>Beta</BetaTag>
                        </BetaTagContainer>
                    </LogoWrap>

                    <MediaQuery minWidth={1200}>
                        <NavLinks>
                            {navItems.map((link, index) => (
                                <NavItem key={`navlink-${index}`} link={link} />
                            ))}
                        </NavLinks>
                        {subMenu}
                    </MediaQuery>

                    <MediaQuery maxWidth={1199}>
                        <div style={{ position: 'relative' }}>
                            <WalletConnectedIndicator isConnected={active} isNavToggled={isNavToggled} />
                            <Hamburger isOpen={isNavToggled} onClick={toggleMobileNav} />
                        </div>
                        <MobileNav
                            navItems={navItems}
                            isToggled={isNavToggled}
                            toggleMobileNav={toggleMobileNav}
                            hasBackButton={false}
                            hasSearch={false}
                            navHeight={active ? 426 : 365}
                        >
                            {subMenu}
                        </MobileNav>
                    </MediaQuery>
                </HeaderWrap>
            </StyledHeader>
        </Headroom>
    );
};

const BetaTagContainer = styled.div`
    padding: 6px 8px;
    background-color: ${colors.backgroundLightGrey};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-bottom: 4px;
`;

const BetaTag = styled.div`
    font-size: 11px;
    line-height: 13px;
    color: ${colors.backgroundDark};
`;

const NavItem: React.FC<NavLinkProps> = ({ link }) => {
    const linkElement = link.url ? (
        <StyledNavLink to={link.url}>{link.text}</StyledNavLink>
    ) : (
        <StyledAnchor href="#">{link.text}</StyledAnchor>
    );
    return <LinkWrap>{linkElement}</LinkWrap>;
};

interface StyledHeaderProps {
    isNavToggled?: boolean;
}

const StyledHeader = styled.header<StyledHeaderProps>`
    padding: 30px;
    background-color: white;
`;

interface WalletConnectedIndicatorProps {
    isConnected: boolean;
    isNavToggled: boolean;
}
const WalletConnectedIndicator = styled.div<WalletConnectedIndicatorProps>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #ffffff;
    background-color: ${(props) => (props.isConnected ? '#00AE99' : '#E71D36')};
    transition: opacity 0.25s ease-in;
    opacity: ${(props) => (props.isNavToggled ? 0 : 1)};
    position: absolute;
    top: -7px;
    right: -7px;
    z-index: ${zIndex.header + 1};
`;

const DocsLogoWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    font-size: var(--defaultHeading);
    color: rgba(0, 0, 0, 0.5);
    margin-left: 0.875rem;
    z-index: ${zIndex.header};
`;

const DocsLogoLink = styled(Link)`
    margin-left: 0.625rem;
`;

const LinkWrap = styled.li`
    position: relative;

    a {
        display: block;
    }

    @media (min-width: 1200px) {
        &:hover > div {
            display: block;
            visibility: visible;
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: opacity 0.35s, transform 0.35s, visibility 0s;
        }
    }
`;

const linkStyles = css<{ theme: ThemeValuesInterface }>`
    color: ${({ theme }) => theme.textColor};
    opacity: 0.5;
    transition: opacity 0.35s;
    padding: 15px 0;
    margin: 0 30px;

    &:hover {
        opacity: 1;
    }
`;

const StyledNavLink = styled(Link).attrs({
    activeStyle: { opacity: 1 },
})`
    ${linkStyles as any};
`;

const StyledAnchor = styled.a`
    ${linkStyles};
    cursor: default;
`;

const HeaderWrap = styled(FlexWrap)`
    justify-content: space-between;
    align-items: center;

    @media (max-width: 800px) {
        padding-top: 0;
        display: flex;
        padding-bottom: 0;
    }
    /* HACK(johnrjj) 48px to make same height as the homepage
    Need to find a better way to make header height static across subsites */
    @media (min-width: 1200px) {
        height: 48px;
    }
`;

const NavLinks = styled.ul`
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 800px) {
        display: none;
    }
`;

const LogoWrap = styled.div`
    display: flex;
    align-items: center;
`;
