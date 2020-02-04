import React, { FC } from 'react';
import styled from 'styled-components';

import { generateUniqueId, Jazzicon } from 'ts/components/ui/jazzicon';
import { ScreenWidths } from 'ts/types';

interface ThumbnailProps {
    size: number;
    poolId: string;
    address: string;
    thumbnailUrl?: string;
    className?: string;
}

export const Thumbnail: FC<ThumbnailProps> = ({ thumbnailUrl, size, poolId, address, className }) =>
    thumbnailUrl ? (
        <Logo className={className} size={size}>
            <img src={thumbnailUrl} />
        </Logo>
    ) : (
        <JazziconContainer className={className} size={size}>
            <Jazzicon diameter={size} seed={generateUniqueId(address, poolId)} isSquare={true} />
        </JazziconContainer>
    );

const BaseLogoContainer = styled.div<{ cutOffRem?: number; size: number }>`
    border: 1px solid #d9d9d9;
    height: ${props => props.size}px;
    width: ${props => props.size}px;

    @media (max-width: ${props => `${props.cutOffRem || ScreenWidths.Lg}rem`}) {
        display: none;
    }
`;

const JazziconContainer = styled(BaseLogoContainer)``;

const Logo = styled(BaseLogoContainer)<{ logoPadding?: number }>`
    padding: ${props => props.logoPadding && `${props.logoPadding}px`};
    display: flex;
    align-items: center;
    justify-content: center;
`;
