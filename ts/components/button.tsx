import { darken } from 'polished';
import * as React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { IThemeInterface } from 'ts/style/theme';

import { colors } from 'ts/style/colors';
import { withFilteredProps } from 'ts/utils/filter_props';

export interface ButtonInterface {
    isDisabled?: boolean;
    className?: string;
    bgColor?: string;
    transparentBgColor?: string;
    borderColor?: string;
    color?: string;
    children?: React.ReactNode | string;
    isTransparent?: boolean;
    isNoBorder?: boolean;
    isNoPadding?: boolean;
    isWithArrow?: boolean;
    isAccentColor?: boolean;
    hasIcon?: boolean | string;
    isInline?: boolean;
    padding?: string;
    fontSize?: string;
    href?: string;
    type?: 'button' | 'reset' | 'submit';
    target?: string;
    textAlign?: string;
    to?: string;
    onClick?: (e: any) => any;
    theme?: IThemeInterface;
    shouldUseAnchorTag?: boolean;
    isFullWidth?: boolean;
    isLarge?: boolean;
    fontWeight?: string;
    width?: string;
}

export const Button: React.StatelessComponent<ButtonInterface> = React.memo((props: ButtonInterface) => {
    const { children, href, isWithArrow, to, shouldUseAnchorTag, target, isDisabled, className } = props;
    const isButton = !href && !to;
    let linkElem;

    if (href || shouldUseAnchorTag) {
        linkElem = 'a';
    }
    if (to) {
        linkElem = withFilteredProps(ReactRouterLink, ['className', 'href', 'to', 'onClick', 'target']);
    }

    const Component = linkElem ? ButtonBase.withComponent<any>(linkElem) : ButtonBase;
    const targetProp: { target?: string; rel?: string } = href && target ? { target } : {};

    // NOTE: See https://developers.google.com/web/tools/lighthouse/audits/noopener
    if (targetProp.target === '_blank') {
        targetProp.rel = 'noopener';
    }

    const buttonProps = isButton ? { disabled: isDisabled } : {};

    return (
        <Component className={className} {...buttonProps} {...props} {...targetProp}>
            {children}

            {isWithArrow && (
                <svg viewBox="0 0 16 15" width="16" height="15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.484.246l.024 1.411 8.146.053L.817 13.547l.996.996L13.65 2.706l.052 8.146 1.412.024L15.045.315 4.484.246z" />
                </svg>
            )}
        </Component>
    );
});

Button.defaultProps = {
    // borderColor: 'rgba(255, 255, 255, .4)',
    textAlign: 'center',
};

const ButtonBase = styled.button<ButtonInterface>`
    appearance: none;
    border: 1px solid transparent;
    display: inline-block;
    background-color: ${props => props.bgColor || colors.brandLight};
    background-color: ${props =>
        (props.isTransparent || props.isWithArrow) && (props.transparentBgColor || 'transparent')};
    border-color: ${props => props.borderColor || (props.isTransparent && !props.isWithArrow && 'rgba(255, 255, 255, 0.4)')};
    color: ${props => (props.isAccentColor ? props.theme.linkColor : props.color || props.theme.textColor)};
    padding: ${props =>
        !props.isNoPadding && !props.isWithArrow && ((!!props.padding && props.padding) || (props.isLarge ? '22px 30px' : '18px 30px'))};
    white-space: ${props => props.isWithArrow && 'nowrap'};
    text-align: ${props => props.textAlign};
    font-size: ${props => (props.fontSize ? props.fontSize : props.isWithArrow ? '20px' : '18px')};
    font-weight: ${props => props.fontWeight ? props.fontWeight : 'normal'};
    text-decoration: none;
    cursor: pointer;
    outline: none;
    transition: background-color 0.35s, border-color 0.35s;
    width: ${props => props.isFullWidth ? '100%' : props.width ? props.width : 'auto'};

    // @todo Refactor to use theme props
    ${props =>
        props.bgColor === 'dark' &&
        `
        background-color: ${colors.brandDark};
        color: ${colors.white};
    `}


    > svg {
        margin-left: 9px;
        transition: transform 0.5s;
        transform: translate3d(-2px, 2px, 0);

        path {
            fill: ${props => (props.isAccentColor ? props.theme.linkColor : props.color || props.theme.textColor)};
        }
    }

    /* Only apply SVG styling if it's an arrow button */
    ${props =>
        props.isWithArrow &&
        css`
            svg {
                margin-left: 9px;
                transition: transform 0.5s;
                transform: translate3d(-2px, 2px, 0);
            }

            &:hover {
                svg {
                    transform: translate3d(2px, -2px, 0);
                }
            }

            path {
                fill: ${props.isAccentColor ? props.theme.linkColor : props.color || props.theme.textColor};
            }
        `}

    &:hover {
        background-color: ${props => !props.isTransparent && !props.isWithArrow && (darken(0.05, props.bgColor || colors.brandLight))};
        border-color: ${props => props.isTransparent && !props.isNoBorder && !props.isWithArrow && '#00AE99'};
    }
`;
