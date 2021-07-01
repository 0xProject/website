import { BigNumber } from '@0x/utils';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Input } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';
import { Thumbnail } from 'ts/components/staking/thumbnail.tsx';

import { useSearch } from 'ts/hooks/use_search';
import { zIndex } from 'ts/style/z_index';
import { PoolWithStats } from 'ts/types';
import { colors } from 'ts/utils/colors';
import { stakingUtils } from 'ts/utils/staking_utils';

interface ChangePoolDialogProps {
    isOpen: boolean;
    onDismiss: () => void;
    onAddPool: (poolId: string) => void;
    stakingPools: PoolWithStats[];
}

interface PoolWithDisplayName extends PoolWithStats {
    displayName: string;
}

const searchOptions = {
    keys: ['displayName'],
};

export const AddPoolDialog: FC<ChangePoolDialogProps> = ({ isOpen, onDismiss, stakingPools, onAddPool }) => {
    const stakingPoolsWithName: PoolWithDisplayName[] = useMemo(
        () =>
            stakingPools.sort(stakingUtils.sortByProtocolFeesDesc).map((pool) => ({
                ...pool,
                displayName: stakingUtils.getPoolDisplayName(pool),
            })),
        [stakingPools],
    );

    const { setSearchTerm, searchResults } = useSearch<PoolWithDisplayName>(stakingPoolsWithName, searchOptions);

    const [selectedPoolId, setSelectedPoolId] = useState<string | undefined>(undefined);

    const clearAndDismiss = () => {
        setSelectedPoolId(undefined);
        setSearchTerm('');
        onDismiss();
    };

    return (
        <StyledDialogOverlay isOpen={isOpen}>
            <StyledDialogContent>
                <ButtonClose isTransparent={true} isNoBorder={true} padding="0px" onClick={clearAndDismiss}>
                    <Icon name="close-modal" />
                </ButtonClose>

                <>
                    <StyledHeading as="h3">Select a pool</StyledHeading>
                    <StyledParagraph>Choose a liquidity pool from the list to rebalance into.</StyledParagraph>

                    <InputWrapper>
                        <Icon name="search" size={18} color="#5C5C5C" />
                        <StyledInput
                            width="full"
                            placeholder="Search Pools"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputWrapper>

                    <PoolsListWrapper>
                        {(searchResults.length ? searchResults : stakingPools).map((pool) => (
                            <Pool
                                key={pool.poolId}
                                onClick={() => setSelectedPoolId(pool.poolId)}
                                isSelected={pool.poolId === selectedPoolId}
                            >
                                <StyledThumbnail
                                    size={40}
                                    thumbnailUrl={pool.metaData.logoUrl}
                                    poolId={pool.poolId}
                                    address={pool.operatorAddress}
                                />
                                {stakingUtils.getPoolDisplayName(pool)}
                            </Pool>
                        ))}
                    </PoolsListWrapper>
                    <ButtonWrapper>
                        <ConfirmButton
                            isDisabled={!selectedPoolId}
                            onClick={() => {
                                onAddPool(selectedPoolId);
                                clearAndDismiss();
                            }}
                        >
                            Choose the selected pool
                        </ConfirmButton>
                    </ButtonWrapper>
                </>
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

const StyledInput = styled(Input)`
    input {
        ::placeholder {
            color: ${(props) => props.theme.textDarkSecondary};
        }

        background-color: ${(props) => props.theme.lightBgColor};
        border: none;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    align-items: baseline;

    @media (min-width: 768px) {
        box-shadow: 0px 1px 0px #b4bebd;
        margin-bottom: 23px;
    }
`;

const PoolsListWrapper = styled.div`
    overflow-y: scroll;
    @media (min-width: 768px) {
        height: 500px;
        max-height: 40vh;
    }
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

    align-self: flex-end;

    path {
        fill: ${colors.black};
    }
`;

const Pool = styled.div<{ isSelected?: boolean }>`
    height: 87px;
    background: #fff;
    border: 1px solid ${(props) => (props.isSelected ? '#00AE99' : '#ddd')};
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    & + & {
        margin-top: 14px;
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
        display: flex;
        flex-direction: column;
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

const StyledThumbnail = styled(Thumbnail)`
    margin: 0 20px;
`;
