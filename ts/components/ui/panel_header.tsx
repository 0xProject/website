import * as React from 'react';
import styled from 'styled-components';

import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';

import { CircleCheckMark } from 'ts/components/ui/circle_check_mark';

interface PanelHeaderProps {
    avatarSrc?: string;
    avatarComponent?: React.ReactNode;
    title: string | React.ReactNode;
    subtitle: string;
    isResponsiveAvatar?: boolean;
    icon?: string;
}

interface AvatarProps {
    isResponsive?: boolean;
}

const Wrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 30px;

    @media (max-width: 768px) {
        p {
            display: none;
        }
    }
`;

const Flex = styled.div`
    display: flex;
    align-items: center;
`;

const Avatar = styled.figure<AvatarProps>`
    width: 80px;
    height: 80px;
    background-color: #fff;
    border: 1px solid ${colors.border};
    margin-right: 20px;
    position: relative;

    img {
        object-fit: cover;
    }

    @media (max-width: 768px) {
        width: 32px;
        height: 32px;
        display: ${props => !props.isResponsive && 'none'};
    }
`;

const IconWrap = styled.div`
    padding: 5px;
    border-radius: 50%;
    border: 1px solid ${colors.border};
    position: relative;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translateX(50%) translateY(50%);
    background-color: ${colors.white};

    svg {
        display: block;
    }
`;

export const PanelHeader: React.StatelessComponent<PanelHeaderProps> = ({
    avatarSrc,
    title,
    subtitle,
    isResponsiveAvatar,
    icon,
}) => {
    return (
        <Wrap>
            {avatarSrc && (
                <Avatar isResponsive={isResponsiveAvatar}>
                    <img src={avatarSrc} />

                    {icon === 'check' &&
                        <IconWrap>
                            <CircleCheckMark fill="#fff" />
                        </IconWrap>
                    }

                    {icon === 'clock' &&
                        <IconWrap>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#fff" d="M12 23.5C5.64614 23.5 0.5 18.3539 0.5 12C0.5 5.64614 5.64614 0.5 12 0.5C18.3539 0.5 23.5 5.64614 23.5 12C23.5 18.3539 18.3539 23.5 12 23.5Z" stroke="black"/>
                                <path d="M11.0762 4.61523V12.6081L18.4608 17.5383" stroke="black"/>
                            </svg>
                        </IconWrap>
                    }
                </Avatar>
            )}

            <div>
                <Flex>
                    <Heading
                        size="small"
                        fontWeight="500"
                        isNoMargin={true}
                        style={{ marginRight: '8px' }}
                    >
                        {title}
                    </Heading>
                </Flex>

                <Paragraph
                    fontSize="17px"
                    isNoMargin={true}
                >
                    {subtitle}
                </Paragraph>
            </div>
        </Wrap>
    );
};
