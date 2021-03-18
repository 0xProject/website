import * as React from 'react';
import styled from 'styled-components';

interface Props {
    image: React.ReactNode;
}

export const LandingAnimation = (props: Props) => <Wrap>{props.image}</Wrap>;

const Wrap = styled.figure`
    svg {
        width: 100%;
        height: auto;
    }

    @media (min-width: 768px) {
        margin-top: -40px;
        margin-left: -10px;
        /* margin-right: -100px;
        margin-top: -110px;
        margin-left: -20px; */
        min-height: 630px;
    }
`;
