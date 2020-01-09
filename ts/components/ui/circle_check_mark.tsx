import * as React from 'react';

interface ICircleCheckMarkProps {
    color?: string;
    width?: string;
    height?: string;
    fill?: string;
}

export const CircleCheckMark: React.FC<ICircleCheckMarkProps> = ({ color, width, height, fill }) => (
    <svg
        style={{ width, height }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 23.25C18.2132 23.25 23.25 18.2132 23.25 12C23.25 5.7868 18.2132 0.75 12 0.75C5.7868 0.75 0.75 5.7868 0.75 12C0.75 18.2132 5.7868 23.25 12 23.25Z"
            stroke={color}
            fill={fill}
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.75 12.25L10.5 16L18 8.5"
            stroke={color}
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

CircleCheckMark.defaultProps = {
    color: '#00AE99',
    width: '24px',
    height: '24px',
};
