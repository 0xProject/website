import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Heading } from 'ts/components/text';
import { InfoTooltip } from 'ts/components/ui/info_tooltip';

import { colors } from 'ts/style/colors';

interface RewardOverviewProps {
    totalAvailableRewards: string;
    estimatedEpochRewards: string;
    lifetimeRewards: string;
    onWithdrawRewards: () => void;
}

interface ActionProps {
    percentWidth?: number;
    percentWidthMobile?: number;
}

export const AccountRewardsOverview: React.StatelessComponent<RewardOverviewProps> = ({
    totalAvailableRewards = '0',
    estimatedEpochRewards = '0',
    lifetimeRewards = '0',
    onWithdrawRewards,
}) => {
    return (
        <Wrap>
            <Flex>
                <Action percentWidth={25} percentWidthMobile={50}>
                    <div>
                        <Heading marginBottom="12px">
                            <FlexHeader>
                                Estimated for this epoch
                                <InfoTooltip id="epoch-estimated-rewards">
                                    This estimate is expected to fluctuate at the beginning of an epoch, and
                                    progressively converge on the final value.
                                </InfoTooltip>
                            </FlexHeader>
                        </Heading>
                        {estimatedEpochRewards} ETH
                    </div>
                </Action>
                <Action percentWidth={25} percentWidthMobile={50}>
                    <div>
                        <Heading marginBottom="12px">Lifetime Rewards</Heading>
                        {lifetimeRewards} ETH
                    </div>
                </Action>
                <CollapsibleAction>
                    <div>
                        <Heading marginBottom="12px">Accumulated Rewards</Heading>
                        {totalAvailableRewards} ETH
                    </div>
                    <div>
                        <ButtonWrapper>
                            <Button
                                color={colors.brandLight}
                                borderColor={colors.border}
                                bgColor={colors.white}
                                fontSize="17px"
                                fontWeight="300"
                                isNoBorder={true}
                                padding="15px 35px"
                                onClick={onWithdrawRewards}
                            >
                                Withdraw to Wallet
                            </Button>
                        </ButtonWrapper>
                    </div>
                </CollapsibleAction>
            </Flex>

            <MobileActions>
                <Button
                    color={colors.white}
                    borderColor={colors.border}
                    bgColor={colors.brandLight}
                    fontSize="17px"
                    fontWeight="300"
                    isNoBorder={true}
                    padding="15px 35px"
                    onClick={onWithdrawRewards}
                >
                    Withdraw Accumulated Rewards ({totalAvailableRewards} ETH)
                </Button>
            </MobileActions>
        </Wrap>
    );
};

const Wrap = styled.div`
    & + & {
        margin-top: 20px;
    }

    @media (max-width: 768px) {
        padding: 20px;
    }
`;

const ButtonWrapper = styled.div`
    @media (min-width: 768px) {
        font-size: 17px;
    }

    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

const FlexBase = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
`;

const Flex = styled(FlexBase)`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (min-width: 768px) {
        padding: 20px 0;

        & + & {
            border-top: 1px solid ${colors.border};
        }
    }
`;

const FlexHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Action = styled(FlexBase)<ActionProps>`
    background-color: ${colors.backgroundLightGrey};
    justify-content: center;
    align-items: center;

    > div {
        text-align: left;
        flex: 1;
        padding: 0.5em; /* add some padding ?*/
        border-right: 1px solid #d9d9d9;
    }

    > div:last-child {
        border: none;
    }

    @media (min-width: 768px) {
        height: 7em;
        width: calc(${(props) => (props.percentWidth ? props.percentWidth : 100)}% - 10px);
        padding: 20px;
        font-size: 20px;

        h1 {
            font-size: 17px;
        }
    }

    @media (max-width: 768px) {
        height: 5.5em;
        width: calc(${(props) => (props.percentWidthMobile ? props.percentWidthMobile : 100)}% - 5px);
        padding: 12px;
        margin-top: 20px;
        font-size: 17px;

        h1 {
            font-size: 14px;
        }
    }
`;

const CollapsibleAction = styled(FlexBase)`
    background-color: ${colors.backgroundLightGrey};
    justify-content: center;
    align-items: center;

    > div {
        text-align: left;
        flex: 1;
        padding: 0.5em; /* add some padding ?*/
    }

    > div:last-child {
        border: none;
    }

    @media (min-width: 768px) {
        height: 7em;
        width: calc(50% - 10px);
        padding: 20px;
        font-size: 20px;

        h1 {
            font-size: 17px;
        }
    }

    @media (max-width: 768px) {
        display: none;
    }
`;

const MobileActions = styled.div`
    button {
        display: block;
        width: 100%;
    }
    margin-top: 22px;

    @media (min-width: 768px) {
        display: none;
    }
`;
