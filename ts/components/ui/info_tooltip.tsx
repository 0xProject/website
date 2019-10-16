import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

interface InfoTooltipProps {
    children: React.ReactNode;
}

export const InfoTooltip = (props: InfoTooltipProps) => {
    return (
        <div data-tip={true} data-for="walletBalance" data-border="true">
            {renderInfoIcon()}

            <StyledTooltip id="walletBalance" className="tooltip-light">
                {props.children}
            </StyledTooltip>
        </div>
    );
};

const renderInfoIcon = () => {
    return (
        <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.7">
                <path d="M3.61176 0.888889C3.61176 1.10367 3.43765 1.27778 3.22287 1.27778C3.0081 1.27778 2.83398 1.10367 2.83398 0.888889C2.83398 0.674111 3.0081 0.5 3.22287 0.5C3.43765 0.5 3.61176 0.674111 3.61176 0.888889Z" fill="white" stroke="#5C5C5C"/>
                <path d="M1 4.88867H3.66667V11.9998" stroke="#5C5C5C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 12H6.33333" stroke="#5C5C5C" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
        </svg>
    );
};

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
