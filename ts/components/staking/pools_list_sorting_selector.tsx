import React, { useState } from 'react';
import styled from 'styled-components';

import { Text } from 'ts/components/ui/text';

import { colors } from 'ts/style/colors';

import { PoolsListSortingParameter } from 'ts/types';

const Wrapper = styled.div`
    width: 450px;
`;

// TODO: align arrow properly
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
`;

const ToggleRow = styled.div`
    text-align: right;
    user-select: none;
    cursor: pointer;
`;

const MenuItem = styled.div`
    cursor: pointer;

    & + & {
        margin-top: 30px;
    }
`;

const StyledText = styled(Text).attrs({
    fontFamily: 'Formular',
    fontSize: '20px',
})`
    font-feature-settings: 'tnum' on, 'lnum' on;
`;

const StyledParagraph = styled(Text).attrs({
    fontFamily: 'Formular',
    fontSize: '17px',
    fontColor: 'rgba(0,0,0,0.7)',
    fontWeight: 300,
})`
    max-width: 350px;
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
                <StyledText Tag="span">Sort by </StyledText>
                <StyledText Tag="span" fontColor={colors.textDarkSecondary}>
                    {sortingParamMapping[currentSortingParam]}{' '}
                </StyledText>
                <Arrow isExpanded={isExpanded} />
            </ToggleRow>
            {isExpanded && (
                <ExpandedMenu>
                    <MenuItem onClick={() => setPoolSortingParam(PoolsListSortingParameter.Staked)}>
                        <StyledText>{sortingParamMapping[PoolsListSortingParameter.Staked]}</StyledText>
                        <StyledParagraph>
                            An approximation for how fully staked the pool is for the upcoming epoch
                        </StyledParagraph>
                    </MenuItem>
                    <MenuItem onClick={() => setPoolSortingParam(PoolsListSortingParameter.RewardsShared)}>
                        <StyledText>{sortingParamMapping[PoolsListSortingParameter.RewardsShared]}</StyledText>
                        <StyledParagraph>
                            An approximation for how fully staked the pool is for the upcoming epoch
                        </StyledParagraph>
                    </MenuItem>
                    <MenuItem onClick={() => setPoolSortingParam(PoolsListSortingParameter.ProtocolFees)}>
                        <StyledText>{sortingParamMapping[PoolsListSortingParameter.ProtocolFees]}</StyledText>
                        <StyledParagraph>
                            An approximation for how fully staked the pool is for the upcoming epoch
                        </StyledParagraph>
                    </MenuItem>
                </ExpandedMenu>
            )}
        </Wrapper>
    );
};
