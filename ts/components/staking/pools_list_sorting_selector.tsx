import React, { useState } from 'react';
import styled from 'styled-components';

import { Text } from 'ts/components/ui/text';

import { colors } from 'ts/style/colors';

import { PoolsListSortingParameter } from 'ts/types';

const Wrapper = styled.div`
    @media (min-width: 768px) {
        width: 450px;
    }
`;

const Arrow = ({ isExpanded }: { isExpanded?: boolean }) => (
    <svg
        style={{ transform: isExpanded ? 'rotate(180deg)' : null }}
        width="13"
        height="6"
        viewBox="0 0 13 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M1 1L6.5 5L12 1" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ExpandedMenu = styled.div`
    background: ${colors.backgroundLightGrey};
    border: 1px solid rgba(92, 92, 92, 0.15);
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 450px;
    padding: 30px;

    @media (max-width: 768px) {
        width: 100%;
        left: 0;
    }
`;

const ToggleRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select: none;
    cursor: pointer;

    * + * {
        margin-left: 8px;
    }
`;

const MenuItem = styled.div`
    cursor: pointer;

    & + & {
        margin-top: 30px;
    }
`;

const StyledText = styled(Text)`
    font-family: 'Formular', monospace;
    font-size: 20px;
    font-feature-settings: 'tnum' on, 'lnum' on;

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

const StyledDescription = styled(Text)`
    font-family: 'Formular', monospace;
    color: rgba(0, 0, 0, 0.7);
    font-weight: 300;
    font-size: 14px;

    @media (min-width: 768px) {
        font-size: 17px;
        max-width: 350px;
    }
`;

const sortingParamMapping = {
    [PoolsListSortingParameter.Staked]: 'Staked',
    [PoolsListSortingParameter.RewardsShared]: 'Rewards Shared',
    [PoolsListSortingParameter.ProtocolFees]: 'Fees Generated',
};

interface PoolsListSortingSelectorProps {
    setPoolSortingParam: (sortingParam: PoolsListSortingParameter) => void;
    currentSortingParam: PoolsListSortingParameter;
}
export const PoolsListSortingSelector: React.FC<PoolsListSortingSelectorProps> = ({
    setPoolSortingParam,
    currentSortingParam,
}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    return (
        <Wrapper onClick={() => setIsExpanded(_isExpanded => !_isExpanded)}>
            <ToggleRow>
                <StyledText>Sort by</StyledText>
                <StyledText fontColor={colors.textDarkSecondary}>{sortingParamMapping[currentSortingParam]}</StyledText>
                <Arrow isExpanded={isExpanded} />
            </ToggleRow>
            {isExpanded && (
                <ExpandedMenu>
                    <MenuItem onClick={() => setPoolSortingParam(PoolsListSortingParameter.Staked)}>
                        <StyledText>{sortingParamMapping[PoolsListSortingParameter.Staked]}</StyledText>
                        <StyledDescription>
                            An approximation for how fully staked the pool is for the upcoming epoch
                        </StyledDescription>
                    </MenuItem>
                    <MenuItem onClick={() => setPoolSortingParam(PoolsListSortingParameter.RewardsShared)}>
                        <StyledText>{sortingParamMapping[PoolsListSortingParameter.RewardsShared]}</StyledText>
                        <StyledDescription>
                            An approximation for how fully staked the pool is for the upcoming epoch
                        </StyledDescription>
                    </MenuItem>
                    <MenuItem onClick={() => setPoolSortingParam(PoolsListSortingParameter.ProtocolFees)}>
                        <StyledText>{sortingParamMapping[PoolsListSortingParameter.ProtocolFees]}</StyledText>
                        <StyledDescription>
                            An approximation for how fully staked the pool is for the upcoming epoch
                        </StyledDescription>
                    </MenuItem>
                </ExpandedMenu>
            )}
        </Wrapper>
    );
};
