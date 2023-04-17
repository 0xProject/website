import * as React from 'react';
import styled from 'styled-components';

import LogoIconShort from 'ts/icons/logo-governance-short.svg';
import LogoIcon from 'ts/icons/logo-governance.svg';
import { IThemeInterface } from 'ts/style/theme';

import { zIndex } from 'ts/style/z_index';

interface LogoInterface {
    theme?: IThemeInterface;
}

// Note let's refactor this
// is it absolutely necessary to have a stateless component
// to pass props down into the styled icon?
const StyledLogo = styled.div`
    text-align: left;
    position: relative;
    z-index: ${zIndex.header};
    height: 31px;
    transform: translateY(-15%);

    @media (max-width: 800px) {
        svg {
            height: 31px;
        }
    }
`;

const Icon = styled(LogoIcon)<LogoInterface>`
    flex-shrink: 0;

    height: 31px;
    display: block;

    @media (max-width: 800px) {
        display: none;
    }

    path {
        fill: ${(props) => props.theme.textColor};
    }
`;

const IconShort = styled(LogoIconShort)<LogoInterface>`
    flex-shrink: 0;

    height: 31px;
    display: none;

    @media (max-width: 800px) {
        display: block;
    }

    path {
        fill: ${(props) => props.theme.textColor};
    }
`;

export const Logo: React.StatelessComponent<LogoInterface> = (props: LogoInterface) => (
    <StyledLogo>
        <Icon {...props} />
        <IconShort />
    </StyledLogo>
);
