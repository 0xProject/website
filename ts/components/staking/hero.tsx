import * as React from 'react';
import styled from 'styled-components';

import { ModalVideo } from 'ts/components/modals/modal_video';
import { VideoPlaceholder } from 'ts/components/video_placeholder';
import { colors } from 'ts/style/colors';

interface StakingHeroProps {
    title: string;
    titleMobile: string;
    description: string;
    figure: React.ReactNode;
    actions: React.ReactNode;
    videoId?: string;
    videoChannel?: string;
    videoRatio?: string;
    youtubeOptions?: any;
}

interface WrapperProps {}

interface InnerProps {}

interface RowProps {}

const Wrapper = styled.div<WrapperProps>`
    width: 100%;
    text-align: center;
    @media (min-width: 768px) {
        padding: 30px;
        text-align: left;
    }
`;

const Inner = styled.div<InnerProps>`
    background-color: ${colors.backgroundLightGrey};
    @media (min-width: 768px) {
        padding: 30px;
    }
`;

const Row = styled.div<RowProps>`
    max-width: 1152px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    @media (min-width: 768px) {
        flex-direction: row;
        & > * {
            width: 50%;
        }
    }
`;

const Column = styled.div`
    padding: 30px;
    @media (min-width: 768px) {
        padding: 60px;
        &:first-child {
            padding-left: 0;
        }
        &:last-child {
            padding-right: 0;
        }
    }
`;

const Video = styled(Column)`
    display: none;
    @media (min-width: 768px) {
        display: block;
    }
`;

const Title = styled.h1`
    font-size: 46px;
    line-height: 1.2;
    font-weight: 300;
    margin-bottom: 20px;
    display: none;
    @media (min-width: 768px) {
        font-size: 50px;
        display: block;
    }
`;

const TitleMobile = styled(Title)`
    display: block;
    @media (min-width: 768px) {
        display: none;
    }
`;

const Description = styled.h2`
    font-size: 18px;
    line-height: 1.45;
    font-weight: 300;
    margin-bottom: 30px;
    color: ${colors.textDarkSecondary};
`;

const Actions = styled.div`
    & > * {
        margin-right: 13px;
        margin-bottom: 10px;
    }
`;

export const StakingHero: React.FC<StakingHeroProps> = props => {
    const { title, titleMobile, description, actions, videoChannel, videoId, videoRatio, youtubeOptions } = props;
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);
    const onOpenVideo = () => setIsVideoOpen(true);
    const onCloseVideo = () => setIsVideoOpen(false);

    return (
        <Wrapper>
            <Inner>
                <Row>
                    <Column>
                        <Title>{title}</Title>
                        <TitleMobile>{titleMobile}</TitleMobile>
                        <Description>{description}</Description>
                        <Actions>{actions}</Actions>
                    </Column>
                    {videoId && (
                        <Video>
                            <VideoPlaceholder title="Play Video" onClick={onOpenVideo} />
                        </Video>
                    )}
                </Row>
            </Inner>
            {videoId && (
                <ModalVideo
                    channel={videoChannel}
                    isOpen={isVideoOpen}
                    videoId={videoId}
                    onClose={onCloseVideo}
                    youtube={{
                        autoplay: 1,
                        controls: 0,
                        showinfo: 0,
                        modestbranding: 1,
                        ...youtubeOptions,
                    }}
                    ratio={videoRatio}
                />
            )}
        </Wrapper>
    );
};

StakingHero.defaultProps = {
    videoChannel: 'youtube',
    videoRatio: '21:9',
};
