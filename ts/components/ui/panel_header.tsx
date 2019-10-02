import * as React from 'react';
import styled from 'styled-components';

import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';

interface PanelHeaderProps {
    avatarSrc?: string;
    avatarComponent?: Node;
    title: string;
    subtitle: string;
}

const Wrap = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Avatar = styled.figure`
    width: 80px;
    height: 80px;
    border: 1px solid ${colors.border};
    margin-right: 30px;
`;

export const PanelHeader: React.StatelessComponent<PanelHeaderProps> = ({
    avatarSrc,
    avatarComponent,
    title,
    subtitle,
}) => {
    return (
        <Wrap>
            <Avatar />

            <div>
                <Heading
                    size="small"
                    fontWeight="500"
                    isNoMargin={true}
                >
                    Lorem ipsum dolor sit amet
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
