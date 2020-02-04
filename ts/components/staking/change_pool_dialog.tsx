import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Thumbnail } from 'ts/components/staking/thumbnail.tsx';

import { zIndex } from 'ts/style/z_index';
import { PoolWithStats } from 'ts/types';
import { stakingUtils } from 'ts/utils/staking_utils';

interface ChangePoolDialogProps {
    isOpen: boolean;
    onDismiss: () => void;
    stakingPools: PoolWithStats[];
    currentPoolDetails?: {
        poolId: string;
        zrxAmount: number;
    };
    moveStake: (fromPoolId: string, toPoolId: string, zrxAmount: number, callback?: () => void) => void;
}

export const ChangePoolDialog: FC<ChangePoolDialogProps> = ({
    isOpen,
    stakingPools,
    moveStake,
    currentPoolDetails = {},
}) => {
    const { poolId: fromPoolId, zrxAmount } = currentPoolDetails;
    return (
        <StyledDialogOverlay isOpen={isOpen}>
            <StyledDialogContent>
                {stakingPools.map(pool => (
                    <Pool key={pool.poolId} onClick={() => moveStake(fromPoolId, pool.poolId, zrxAmount)}>
                        <StyledThumbnail
                            size={40}
                            thumbnailUrl={pool.metaData.logoUrl}
                            poolId={pool.poolId}
                            address={pool.operatorAddress}
                        />
                        {stakingUtils.getPoolDisplayName(pool)}
                    </Pool>
                ))}
            </StyledDialogContent>
        </StyledDialogOverlay>
    );
};

const Pool = styled.div`
    height: 87px;
    background: #fff;
    border: 1px solid #ddd;
    display: flex;
    flex-direction: row;
    align-items: center;

    & + & {
        margin-top: 14px;
    }
`;

const StyledDialogOverlay = styled(DialogOverlay)`
    &[data-reach-dialog-overlay] {
        background-color: rgba(0, 0, 0, 0.75);
        z-index: ${zIndex.overlay};

        @media (max-width: 768px) {
            background: white;
        }
    }
`;

const StyledDialogContent = styled(DialogContent)`
    &[data-reach-dialog-content] {
        width: 571px;
        background: ${props => props.theme.bgColor};
        border: 1px solid #e5e5e5;

        @media (max-width: 768px) {
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 30px;

            border: none;
        }
    }
`;

const StyledThumbnail = styled(Thumbnail)`
    margin 0 20px;
`;
