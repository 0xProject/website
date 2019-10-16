import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';

import { colors } from 'ts/style/colors';

interface InfoTooltipProps {
    children: React.ReactNode;
    className?: string;
}

export const InfoTooltip = (props: InfoTooltipProps) => {
    return (
        <div className={props.className} data-tip={true} data-for="walletBalance" data-border="true">
            <StyledIcon name="info" size={13} />

            <StyledTooltip id="walletBalance" className="tooltip-light">
                {props.children}
            </StyledTooltip>
        </div>
    );
};

const StyledIcon = styled(Icon)`
    path {
        fill: ${colors.textDarkSecondary};
    }
`;

const StyledTooltip = styled(ReactTooltip)`
    &.tooltip-light {
        background-color: #f6f6f6;
        max-width: 390px;
        padding: 20px;
        font-size: 18px;
        color: ${colors.textDarkPrimary};
        line-height: 1.5;

        @media (min-width: 768px) {
            &:before {
                border-top-color: ${colors.border} !important;
            }
            &:after {
                border-top-color: #f6f6f6 !important;
            }
        }

        @media (max-width: 768px) {
            &:before {
                border-left-color: ${colors.border} !important;
            }
            &:after {
                border-left-color: #f6f6f6 !important;
            }
        }
    }
    &.tooltip-light.border {
        border: 1px solid ${colors.border};
    }
`;
