import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

interface ProgressbarProps {
    progress: number;
}

interface BarProps {
    progress: number;
}

interface ContainerProps {
    isOverLimit?: boolean;
}

const Container = styled.div<ContainerProps>`
    height: 5px;
    width: 100%;
    background-color: ${props => (props.isOverLimit ? colors.error : colors.brandLightest)};
    position: relative;
`;

const Bar = styled.div<BarProps>`
    transition: width 0.3s ease;
    width: ${props => props.progress}%;
    background-color: ${colors.brandLight};
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
`;

export const Progressbar: React.FC<ProgressbarProps> = (props: ProgressbarProps) => {
    let adjustedProgress;
    let isOverLimit;
    if (props.progress > 100) {
        adjustedProgress = Math.round((100 / props.progress) * 100);
        isOverLimit = true;
    } else {
        adjustedProgress = props.progress;
    }

    return (
        <Container isOverLimit={isOverLimit}>
            <Bar progress={adjustedProgress} />
        </Container>
    );
};
