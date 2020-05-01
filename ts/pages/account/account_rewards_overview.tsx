import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Heading } from 'ts/components/text';

import { colors } from 'ts/style/colors';

interface RewardOverviewProps {
    totalAvailableRewards: string;
    estimatedEpochRewards: string;
    lifetimeRewards: string;
    onWithdrawRewards: () => void;
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
                <Action>
                    <div>
                        <LeftJustifiedContent>
                            <Heading marginBottom="12px">
                                    Lifetime Rewards
                            </Heading>
                            {lifetimeRewards} ETH
                        </LeftJustifiedContent>
                    </div>
                    <div>
                        <LeftJustifiedContent>
                            <Heading marginBottom="12px">
                                Estimated for this epoch
                            </Heading>
                            {estimatedEpochRewards} ETH
                        </LeftJustifiedContent>
                    </div>
                </Action>
                <CollapsibleAction>
                    <div>
                        <LeftJustifiedContent>
                            <Heading marginBottom="12px">
                                Available Rewards
                            </Heading>
                            {totalAvailableRewards} ETH
                        </LeftJustifiedContent>
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
                    Withdraw Available Rewards ({totalAvailableRewards} ETH)
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
        /*background: ${colors.backgroundLightGrey};*/
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

const LeftJustifiedContent = styled.div`
    text-align: left;
    display: inline-block;
`;

const Action = styled(FlexBase)`
    background-color: ${colors.backgroundLightGrey};
    justify-content: center;
    align-items: center;

    > div {
        text-align: center;
        flex: 1;
        padding: 0.5em;/* add some padding ?*/
        border-right: 1px solid #D9D9D9;
    }

    > div:last-child {
        border: none;
    }

    @media (min-width: 768px) {
        height: 7em;
        width: calc(50% - 10px);
        padding: 20px;
        font-size: 17px;

        h1 {
            font-size: 14px;
        }
    }

    @media (max-width: 768px) {
        height: 4em;
        width: calc(100%);
        margin-top: 20px;
        font-size: 14px;

        h1 {
            font-size: 12px;
        }
    }
`;

const CollapsibleAction = styled(FlexBase)`
    background-color: ${colors.backgroundLightGrey};
    justify-content: center;
    align-items: center;

    > div {
        text-align: center;
        flex: 1;
        padding: 0.5em;/* add some padding ?*/
        border-right: 1px solid #D9D9D9;
    }

    > div:last-child {
        border: none;
    }

    @media (min-width: 768px) {
        height: 7em;
        width: calc(50% - 10px);
        padding: 20px;
        font-size: 17px;

        h1 {
            font-size: 14px;
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
