import * as React from 'react';
import { useWindowSize } from 'react-use';
import styled, { ThemeProvider } from 'styled-components';

import { Footer } from 'ts/components/footer';
import { Header as MainHeader } from 'ts/components/header';
// import { ZeroexpoBanner } from 'ts/components/zrxpo_banner';

import { GlobalStyles } from 'ts/constants/globalStyle';
import { GLOBAL_THEMES } from 'ts/style/theme';

interface ISiteWrapProps {
    theme?: 'dark' | 'light' | 'gray' | 'staking';
    isDocs?: boolean;
    shouldShowDisclaimerInFooter?: boolean;
    headerComponent?: any;
    isFullScreen?: boolean;
    children: any;
}

interface IMainProps {
    isNavToggled: boolean;
    isFullScreen?: boolean;
}

export const SiteWrap: React.FC<ISiteWrapProps> = (props) => {
    const { children, theme = 'dark', isDocs, isFullScreen, headerComponent, shouldShowDisclaimerInFooter } = props;
    const [isMobileNavOpen, setIsMobileNavOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        document.documentElement.style.overflowY = 'auto';
        window.scrollTo(0, 0);
    }, []);

    const Header = headerComponent || MainHeader;
    const { width: windowWidth } = useWindowSize();
    // const isSmallScreen = windowWidth < 700;

    const toggleMobileNav = React.useCallback(() => setIsMobileNavOpen(!isMobileNavOpen), [isMobileNavOpen]);

    return (
        <ThemeProvider theme={GLOBAL_THEMES[theme]}>
            <>
                <GlobalStyles />
                {/* <ZeroexpoBanner isMobile={isSmallScreen} /> */}

                <Header isNavToggled={isMobileNavOpen} toggleMobileNav={toggleMobileNav} />

                <Main isNavToggled={isMobileNavOpen} isFullScreen={isFullScreen}>
                    {children}
                </Main>

                <Footer isDocs={isDocs} shouldShowDisclaimer={shouldShowDisclaimerInFooter} />
            </>
        </ThemeProvider>
    );
};

const Main = styled.main<IMainProps>`
    transition: transform 0.5s, opacity 0.5s;
    opacity: ${(props) => props.isNavToggled && '0.5'};
    padding-bottom: 70px;

    ${(props) =>
        props.isFullScreen &&
        `
        display: flex;
        align-items: center;
        min-height: calc(100vh - 108px - 381px);
    `}
`;
