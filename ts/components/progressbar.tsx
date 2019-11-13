import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

interface ProgressbarProps {
    progress: number;
}

interface BarProps {
    width: number;
}

const Container = styled.div`
    height: 5px;
    width: 100%;
    background-color: ${colors.brandLightest};
    position: relative;
`;

const Bar = styled.div<BarProps>`
    transition: width 0.3s ease;
    width: ${props => props.width}%;
    background-color: ${colors.brandLight};
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
`;

export const Progressbar: React.FC<ProgressbarProps> = (props: ProgressbarProps) => {
    return (
        <Container>
            <Bar width={props.progress} />
        </Container>
    );
};
