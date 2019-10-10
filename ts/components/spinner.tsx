import React from 'react';
import styled from 'styled-components';

interface SpinnerProps {
    size?: string;
    color?: string;
}

const SpinnerStyle = styled.div<SpinnerProps>`
    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }

    content: '';
    box-sizing: border-box;
    width: ${props => (props.size === 'big' ? '40px' : '20px')};
    height: ${props => (props.size === 'big' ? '40px' : '20px')};
    border-radius: 50%;
    border: 1px solid ${props => props.color};
    border-top-color: #000;
    animation: spinner 0.6s linear infinite;
`;

export const Spinner: React.FC<SpinnerProps> = ({ size, color }) => {
    return <SpinnerStyle size={size} color={color} />;
};
