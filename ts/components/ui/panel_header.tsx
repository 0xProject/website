import * as React from 'react';
import styled from 'styled-components';

import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';

interface PanelHeaderProps {
    avatarSrc?: string;
    avatarComponent?: React.ReactNode;
    title: string | React.ReactNode;
    subtitle: string;
    isResponsiveAvatar?: boolean;
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

const Avatar = styled.figure<AvatarProps>`
    width: 80px;
    height: 80px;
    background-color: #fff;
    border: 1px solid ${colors.border};
    margin-right: 30px;

    img {
        object-fit: cover;
    }

    @media (max-width: 768px) {
        width: 32px;
        height: 32px;
        display: ${props => !props.isResponsive && 'none'};
    }
`;

export const PanelHeader: React.StatelessComponent<PanelHeaderProps> = ({
    avatarSrc,
    title,
    subtitle,
    isResponsiveAvatar,
}) => {
    return (
        <Wrap>
            {avatarSrc && (
                <Avatar isResponsive={isResponsiveAvatar}>
                    <img src={avatarSrc} />
                </Avatar>
            )}

            <div>
                <Heading
                    size="small"
                    fontWeight="500"
                    isNoMargin={true}
                >
                    {title}
                </Heading>

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
