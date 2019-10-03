import * as React from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';

import { Link } from 'ts/components/documentation/shared/link';

import { Button } from 'ts/components/button';
import { SearchInput } from 'ts/components/docs/search/search_input';

import { colors } from 'ts/style/colors';
import { zIndex } from 'ts/style/z_index';

import { WebsitePaths } from 'ts/types';

interface IMobileNavProps {
    isToggled: boolean;
    toggleMobileNav: () => void;
    navItems: INavItems[];
    children?: React.ReactNode;
    hasBackButton?: boolean;
    hasSearch?: boolean;
    navHeight?: number;
}

interface INavItems {
    url?: string;
    id?: string;
    text?: string;
    dropdownWidth?: number;
    dropdownComponent?: React.FunctionComponent<any>;
}

export const MobileNav: React.FC<IMobileNavProps> = props => {
    const { navItems, isToggled, toggleMobileNav, children, hasSearch, hasBackButton, navHeight } = props;

    return (
        <MediaQuery maxWidth={1199}>
            <Wrap isToggled={isToggled} navHeight={navHeight}>
                <Section>
                    {hasSearch && <SearchInput isHome={false} />}

                    <ul>
                        {navItems.map(link => (
                            <li key={link.id}>
                                <MobileNavLink to={link.url}>{link.text}</MobileNavLink>
                            </li>
                        ))}
                    </ul>
                </Section>

                {children}
                {hasBackButton && (
                    <BackButton
                        to={WebsitePaths.Home}
                        textAlign="left"
                        transparentBgColor={colors.backgroundLight}
                        isWithArrow={true}
                    >
                        Back to main site
                    </BackButton>
                )}

                {isToggled && <Overlay onClick={toggleMobileNav} />}
            </Wrap>
        </MediaQuery>
    );
};

MobileNav.defaultProps = {
    hasBackButton: true,
    hasSearch: true,
    navHeight: 426,
};

const BackButton = styled(Button)`
    padding: 24px 30px;
`;

const Wrap = styled.nav<{ isToggled: boolean; navHeight: number }>`
    width: 100%;
    height: ${props => props.navHeight}px;
    background-color: ${props => props.theme.mobileNavBgUpper};
    color: ${props => props.theme.mobileNavColor};
    transition: ${props => (props.isToggled ? 'visibility 0s, transform 0.5s' : 'visibility 0s 0.5s, transform 0.5s')};
    transform: translate3d(0, ${props => (props.isToggled ? 0 : '-100%')}, 0);
    visibility: ${props => !props.isToggled && 'hidden'};
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    z-index: ${zIndex.mobileNav};
    top: 0;
    left: 0;
    font-size: 20px;

    h4 {
        font-size: 14px;
        opacity: 0.5;
    }
`;

const MobileNavLink = styled(Link)`
    padding: 15px 0;
    display: block;
    color: inherit;
`;

const Overlay = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 100%;
    background: transparent;
    cursor: pointer;
`;

const Section = styled.div`
    width: 100%;
    padding: 15px 30px;
`;
