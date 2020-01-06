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
    background-color: ${colors.black};
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
`;

const CoverImage = styled.img`
    height: 100%;
    display: block;
    max-width: 100%;
    object-fit: cover;
`;

const TitleContainer = styled.div`
    display: flex;
    position: absolute;
    align-items: center;
    bottom: 0px;
    left: 0px;
    margin: 0 0 25px 25px;
`;

const Title = styled.h3`
    color: ${colors.white};
    font-size: 16px;
    text-align: left;
    svg {
        path {
            fill: ${colors.white};
        }
    }
`;

const StyledPlayIcon = styled(PlayIcon)`
    height: 12px;
    margin-right: 6px;
`;

export const VideoPlaceholder: React.FC<VideoPlaceholderProps> = props => {
    const { title, onClick } = props;

    return (
        <Wrapper onClick={onClick}>
            <Inner>
                <CoverImage src={'/images/zrx_staking_video_preview.png'} />
                <TitleContainer>
                    <Title>
                        <StyledPlayIcon />
                        {title}
                    </Title>
                </TitleContainer>
            </Inner>
        </Wrapper>
    );
};
