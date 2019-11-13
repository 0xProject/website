import * as React from 'react';
import styled from 'styled-components';

import PlayIcon from 'ts/icons/illustrations/play.svg';
import { colors } from 'ts/style/colors';

interface VideoPlaceholderProps {
    title: string;
    onClick: () => void;
}

const Wrapper = styled.button`
    width: 100%;
    background-color: ${colors.white};
    padding-bottom: 60%;
    position: relative;
    border: 0;
    cursor: pointer;
`;

const Inner = styled.div`
    background-color: ${colors.white};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
`;

const Title = styled.h3`
    color: ${colors.brandLight};
    font-size: 20px;
    width: 100%;
    text-align: center;
    svg {
        path {
            fill: ${colors.brandLight};
        }
    }
`;

export const VideoPlaceholder: React.FC<VideoPlaceholderProps> = props => {
    const { title, onClick } = props;

    return (
        <Wrapper onClick={onClick}>
            <Inner>
                <Title>
                    <PlayIcon /> {title}
                </Title>
            </Inner>
        </Wrapper>
    );
};
