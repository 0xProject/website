import * as React from 'react';
import styled from 'styled-components';
import { WrapGrid, WrapProps } from 'ts/components/newLayout';
import { zIndex } from 'ts/style/z_index';
import { WebsitePaths } from 'ts/types';
import { constants } from 'ts/utils/constants';

import { Link } from 'ts/components/documentation/shared/link';

interface IMobileNavProps {
    isToggled: boolean;
    toggleMobileNav: () => void;
}

export const MobileNav: React.FC<IMobileNavProps> = (props) => {
    const { isToggled, toggleMobileNav } = props;

    return (
        <Wrap isToggled={isToggled}>
            <Section>
                <h4>Products</h4>
                <ul>
                    <li>
                        <Link to={constants.MATCHA_PRODUCTION_URL} shouldOpenInNewTab={true}>
                            Matcha
                        </Link>
                    </li>
                    <li>
                        <Link to={WebsitePaths.Vote}>ZRX</Link>
                    </li>
                </ul>
            </Section>

            <Section isDark={true}>
                <Grid as="ul" isFullWidth={true} isWrapped={true}>
                    <li>
                        <Link to={WebsitePaths.Why}>Why 0x</Link>
                    </li>
                    <li>
                        <Link to="https://docs.0x.org" shouldOpenInNewTab={true}>
                            Docs
                        </Link>
                    </li>
                    <li>
                        <Link to={WebsitePaths.AboutMission}>About</Link>
                    </li>
                    <li>
                        <Link to={constants.URL_BLOG} shouldOpenInNewTab={true}>
                            Blog
                        </Link>
                    </li>
                </Grid>
            </Section>

            {isToggled && <Overlay onClick={toggleMobileNav} />}
        </Wrap>
    );
};

const Wrap = styled.nav<{ isToggled: boolean }>`
    width: 100%;
    height: 350px;
    background-color: ${(props) => props.theme.mobileNavBgUpper};
    color: ${(props) => props.theme.mobileNavColor};
    transition: ${(props) =>
        props.isToggled ? 'visibility 0s, transform 0.5s' : 'visibility 0s 0.5s, transform 0.5s'};
    transform: translate3d(0, ${(props) => (props.isToggled ? 0 : '-100%')}, 0);
    visibility: ${(props) => !props.isToggled && 'hidden'};
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    z-index: ${zIndex.mobileNav};
    top: 0;
    left: 0;
    font-size: 20px;

    a {
        padding: 15px 0;
        display: block;
        color: inherit;
    }

    h4 {
        font-size: 14px;
        opacity: 0.5;
    }
`;

const Overlay = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 100%;
    background: transparent;
    cursor: pointer;
`;

interface ISectionProps {
    isDark?: boolean;
}

const Section = styled.div<ISectionProps>`
    width: 100%;
    padding: 15px 30px;
    background-color: ${(props) => (props.isDark ? props.theme.mobileNavBgLower : 'transparent')};
`;

const Grid = styled(WrapGrid)<WrapProps>`
    justify-content: flex-start;

    li {
        width: 50%;
        flex-shrink: 0;
    }
`;
