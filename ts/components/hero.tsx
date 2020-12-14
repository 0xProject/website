import * as React from 'react';
import styled from 'styled-components';
import { addFadeInAnimation } from 'ts/constants/animations';

import { Announcement, AnnouncementProps } from './announcement';

interface Props {
    title: string;
    maxWidthContent?: string;
    maxWidth?: string;
    labelText?: string;
    maxWidthHeading?: string;
    isLargeTitle?: boolean;
    isFullWidth?: boolean;
    isCenteredMobile?: boolean;
    description: React.ReactNode | string;
    figure?: React.ReactNode;
    actions?: React.ReactNode;
    background?: React.ReactNode;
    announcement?: AnnouncementProps;
    sectionPadding?: string;
    showFigureBottomMobile?: boolean;
    hideFigureOnMobile?: boolean;
    maxWidthFigure?: string;
    alignItems?: string;
}

interface SectionProps {
    isAnnouncement?: boolean;
    padding?: string;
}

const Section = styled.section<SectionProps>`
    padding: ${props => props.padding || (props.isAnnouncement ? '50px 0 120px 0' : '120px 0')};
    position: relative;
    @media (max-width: 768px) {
        padding: 30px 0 60px 0;
    }
`;

interface WrapProps {
    isCentered?: boolean;
    isFullWidth?: boolean;
    isCenteredMobile?: boolean;
    showFigureBottomMobile?: boolean;
    maxWidth?: string;
    alignItems?: string;
}
const Wrap = styled.div<WrapProps>`
    width: calc(100% - 60px);
    margin: 0 auto;

    @media (min-width: 768px) {
        max-width: ${props => (!props.isFullWidth ? '895px' : props.maxWidth ?? '1136px')};
        flex-direction: row-reverse;
        display: flex;
        align-items: ${props => props.alignItems ?? 'center'};
        text-align: ${props => props.isCentered && 'center'};
        justify-content: ${props => (props.isCentered ? 'center' : 'space-between')};
    }

    @media (max-width: 768px) {
        text-align: ${props => (props.isCenteredMobile ? `center` : 'left')};
        flex-direction: ${props => (props.showFigureBottomMobile ? 'column-reverse' : 'column')};
        display: flex;
        align-items: center;
    }
`;

interface TitleProps {
    isLarge?: boolean;
    maxWidth?: string;
}
const Title = styled.h1<TitleProps>`
    font-size: ${props => (props.isLarge ? '70px' : '50px')};
    font-weight: 300;
    line-height: 1.2;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 30px;
    max-width: ${props => props.maxWidth};
    ${addFadeInAnimation('0.5s', '0.05s')}

    @media (max-width: 1024px) {
        font-size: 60px;
    }

    @media (max-width: 768px) {
        font-size: 46px;
    }
`;

const Description = styled.p`
    font-size: 22px;
    line-height: 31px;
    font-weight: 300;
    padding: 0;
    margin-bottom: 50px;
    color: ${props => props.theme.introTextColor};
    ${addFadeInAnimation('0.5s', '0.15s')} @media (max-width: 1024px) {
        margin-bottom: 30px;
    }
`;

interface ContentProps {
    width: string;
    isCenteredMobile?: boolean;
    hideFigureOnMobile?: boolean;
}

const Content = styled.div<ContentProps>`
    width: 100%;
    @media (max-width: 768px) {
        display: ${props => props.hideFigureOnMobile ? 'none' : props.isCenteredMobile ? 'flex' : 'block'};
        justify-content: ${props => props.isCenteredMobile ? 'center' : 'inherit'}
    }
    @media (min-width: 768px) {
        max-width: ${props => props.width};
    }
    @media (min-width: 768px) {
        max-width: ${props => props.width};
    }
    /* ${props =>
        props.isCenteredMobile &&
        `
        @media (max-width: 768px) {
            display: flex;
            justify-content: center;
        }
    `}; */
`;

const ButtonWrap = styled.div`
    display: inline-flex;
    align-items: center;

    * + * {
        margin-left: 12px;
    }

    > *:nth-child(1) {
        ${addFadeInAnimation('0.6s', '0.3s')};
    }
    > *:nth-child(2) {
        ${addFadeInAnimation('0.6s', '0.4s')};
    }

    @media (max-width: 500px) {
        flex-direction: column;
        justify-content: center;

        > * {
            padding-left: 20px;
            padding-right: 20px;
        }

        * + * {
            margin-left: 0;
            margin-top: 12px;
        }
    }
`;

const BackgroundWrap = styled.div`
    position: absolute;
    overflow: hidden;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
`;

const Label = styled.div`
    font-weight: 300;
    font-size: 22px;
    color: #898990;
    font-feature-settings: 'tnum' on, 'lnum' on;
    margin-bottom: 20px;
    @media (min-width: 768px) {
        margin-top: 35px;
    }
    ${addFadeInAnimation('0.5s')}
`;

export class Hero extends React.Component<Props> {
    public static defaultProps = {
        isCenteredMobile: true,
    };
    public shouldComponentUpdate(): boolean {
        // The hero is a static component with animations.
        // We do not want state changes in parent components to re-trigger animations.
        return false;
    }
    public render(): React.ReactNode {
        const props = this.props;
        return (
            <Section padding={props.sectionPadding} isAnnouncement={!!props.announcement}>
                {!!props.background && <BackgroundWrap>{props.background}</BackgroundWrap>}
                <Wrap
                    maxWidth={props.maxWidth}
                    isCentered={!props.figure}
                    isFullWidth={props.isFullWidth}
                    isCenteredMobile={props.isCenteredMobile}
                    showFigureBottomMobile={props.showFigureBottomMobile}
                    alignItems={props.alignItems}
                >
                    {props.figure && (
                        <Content 
                        hideFigureOnMobile={props.hideFigureOnMobile}
                        isCenteredMobile={props.isCenteredMobile} 
                        width={props.maxWidthFigure || '400px'}
                        >
                            {props.figure}
                        </Content>
                    )}

                    <Content width={props.maxWidthContent ? props.maxWidthContent : props.figure ? '580px' : '678px'}>
                        {!!props.announcement && <Announcement {...props.announcement} />}
                        {!!props.labelText && <Label>{props.labelText}</Label>}
                        <Title isLarge={props.isLargeTitle} maxWidth={props.maxWidthHeading}>
                            {props.title}
                        </Title>

                        <Description>{props.description}</Description>

                        {props.actions && <ButtonWrap>{props.actions}</ButtonWrap>}
                    </Content>
                </Wrap>
            </Section>
        );
    }
}
