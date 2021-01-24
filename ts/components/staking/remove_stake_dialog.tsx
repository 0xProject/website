import { BigNumber } from '@0x/utils';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Heading, Paragraph } from 'ts/components/text';

import { zIndex } from 'ts/style/z_index';
import { PoolWithStats } from 'ts/types';
import { colors } from 'ts/utils/colors';
import { formatEther, formatZrx } from 'ts/utils/format_number';
import { stakingUtils } from 'ts/utils/staking_utils';

interface RemoveStakeDialogProps {
    isOpen: boolean;
    onDismiss: () => void;
    stakingPools: PoolWithStats[];
    poolDetails?: {
        poolId: string;
        zrxAmount: number;
    };
    nextEpochStart: Date;
    availableRewardsMap?: { [key: string]: BigNumber };
    onRemoveStake: (poolId: string, zrxAmount: number) => void;
}

export const RemoveStakeDialog: FC<RemoveStakeDialogProps> = ({
    isOpen,
    onDismiss,
    stakingPools,
    onRemoveStake,
    nextEpochStart,
    availableRewardsMap,
    poolDetails,
}) => {
    if (!poolDetails) {
        return null;
    }

    const { poolId, zrxAmount } = poolDetails;

    const pool = stakingPools.find((p) => p.poolId === poolId);
    const formattedAmount = formatZrx(zrxAmount).minimized;

    return (
        <StyledDialogOverlay isOpen={isOpen}>
            <StyledDialogContent>
                <ButtonClose isTransparent={true} isNoBorder={true} padding="0px" onClick={onDismiss}>
                    <Icon name="close-modal" />
                </ButtonClose>
                <StyledHeading as="h3">Remove stake confirmation</StyledHeading>
                <StyledParagraph>
                    You are removing {formattedAmount} ZRX from {stakingUtils.getPoolDisplayName(pool)}.
                </StyledParagraph>
                <StyledParagraph>
                    This will take into effect in the next epoch ({stakingUtils.getTimeToEpochDate(nextEpochStart)}).
                </StyledParagraph>
                <StyledParagraph>
                    The rewards you have collected with this pool{' '}
                    {availableRewardsMap?.[pool.poolId]
                        ? `(${formatEther(availableRewardsMap[pool.poolId]).minimized} ETH) `
                        : ''}
                    will automatically be sent to your wallet now, reflecting in a decrease in the 'available rewards'
                    balance.
                </StyledParagraph>
                <ButtonWrapper>
                    <ConfirmButton
                        onClick={() => {
                            onRemoveStake(pool.poolId, zrxAmount);
                            onDismiss();
                        }}
                    >
                        I understand, remove my stake
                    </ConfirmButton>
                </ButtonWrapper>
            </StyledDialogContent>
        </StyledDialogOverlay>
    );
};

const ButtonWrapper = styled.div`
    margin-top: 33px;
    display: flex;
    justify-content: flex-end;

    @media (max-width: 768px) {
        justify-content: center;
    }
`;

const StyledParagraph = styled(Paragraph)`
    font-style: normal;
    font-weight: 300;
    font-size: 18px;
    line-height: 26px;
`;

const StyledHeading = styled(Heading)`
    font-size: 34px;
    line-height: 42px;
    margin-bottom: 20px;

    font-feature-settings: 'tnum' on, 'lnum' on;
`;

const ConfirmButton = styled(Button)`
    background-color: ${(props) => props.isDisabled && '#898990'};
    cursor: ${(props) => (props.isDisabled ? 'not-allowed' : 'pointer')};
    color: #fff;
    &:hover {
        background-color: ${(props) => props.isDisabled && '#898990'};
    }
`;

const ButtonClose = styled(Button)`
    width: 18px;
    height: 18px;
    border: none;
    position: absolute;
    right: -10px;
    top: -30px;

    @media (max-width: 768px) {
        top: 15px;
        right: 15px;
    }

    path {
        fill: ${colors.black};
    }
`;

const StyledDialogOverlay = styled(DialogOverlay)`
    &[data-reach-dialog-overlay] {
        background-color: rgba(255, 255, 255, 0.8);
        z-index: ${zIndex.overlay};

        @media (min-width: 768px) {
            overflow: hidden;
        }
    }
`;

const StyledDialogContent = styled(DialogContent)`
    &[data-reach-dialog-content] {
        position: relative;
        width: 600px;
        background: ${(props) => props.theme.lightBgColor};
        border: 1px solid #e5e5e5;

        @media (max-width: 768px) {
            min-height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 30px;

            border: none;
        }
    }
`;
