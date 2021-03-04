import * as _ from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Heading } from 'ts/components/text';
import { CircleCheckMark } from 'ts/components/ui/circle_check_mark';
import { generateUniqueId, Jazzicon } from 'ts/components/ui/jazzicon';
import { PanelHeader } from 'ts/components/ui/panel_header';
import { StatFigure } from 'ts/components/ui/stat_figure';
import { State } from 'ts/redux/reducer';
import { AccountReady } from 'ts/types';

import { colors } from 'ts/style/colors';
import { formatZrx } from 'ts/utils/format_number';

interface UserData {
    zrxStakedFormatted: string;
    rewardsReceivedFormatted: string;
}

interface VotingPowerOverviewProps {
    name: string;
    operatorAddress: string;
    poolId: string;
    delegation: number;
    isVerified: boolean;
    websiteUrl?: string;
    logoUrl?: string;
}

interface SelfVotingPowerOverviewProps {
    delegation: number;
    isSelfDelegated: boolean;
    onMoveStake: () => void;
}

export const AccountVotingPowerOverview: React.StatelessComponent<VotingPowerOverviewProps> = ({
    name,
    websiteUrl,
    logoUrl,
    operatorAddress,
    poolId,
    isVerified,
    delegation,
}) => {
    return (
        <Wrap>
            <Flex>
                <PanelHeader
                    subtitle={websiteUrl}
                    avatarSrc={logoUrl}
                    isResponsiveAvatar={true}
                    address={operatorAddress}
                    poolId={poolId}
                >
                    <Title>
                        {name}
                        {isVerified && <CircleCheckMark />}
                    </Title>
                </PanelHeader>

                <Stats>
                    <StatFigure label="Your Delegation" value={formatZrx(delegation).formatted} isNoBorder={true} showZrxLabel={true} />
                </Stats>
            </Flex>
        </Wrap>
    );
};

export const AccountSelfVotingPowerOverview: React.StatelessComponent<SelfVotingPowerOverviewProps> = ({
    delegation,
    isSelfDelegated,
    onMoveStake
}) => {
  const providerState = useSelector((state: State) => state.providerState);

    return (
        <Wrap>
            <Flex>
              <Header>
                <JazzIconContainer>
                    <Jazzicon diameter={80} isSquare={true} seed={providerState.account && generateUniqueId((providerState.account as AccountReady).address)} />
                </JazzIconContainer>
                <Title>
                    { isSelfDelegated ? 'You (self delegated)' : 'You' }
                </Title>
              </Header>

              <Stats>
                  <StatFigure label="Your Delegation" value={formatZrx(delegation).formatted} isNoBorder={true} showZrxLabel={true} />
                  {isSelfDelegated && <ButtonWrapper>
                      <Button
                          color={colors.brandLight}
                          borderColor={colors.border}
                          bgColor={colors.white}
                          fontSize="17px"
                          fontWeight="400"
                          isNoBorder={true}
                          padding="15px 35px"
                          onClick={onMoveStake}
                      >
                          Change
                      </Button>
                    </ButtonWrapper>
                  }
              </Stats>

            </Flex>
        </Wrap>
    );
};

const Wrap = styled.div`
    & + & {
        margin-top: 20px;
    }

    @media (min-width: 768px) {
        padding: 0 20px;
        border: 1px solid ${colors.border};
    }

    @media (max-width: 768px) {
        padding: 20px;
        background: ${colors.backgroundLightGrey};
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    button {
        width: 133px;
    }

    button + button {
        margin-left: 10px;
    }
`;

const FlexBase = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
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

const Stats = styled(Flex)`
  background-color: ${() => colors.backgroundLightGrey};
  width: 50%;
  padding-right: 20px !important;
`;

const Title = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    svg {
        margin-left: 8px;
    }
`;

const Action = styled(FlexBase)`
    width: calc(50% - 10px);
    background-color: ${colors.backgroundLightGrey};

    > div {
        font-size: 18px;
        flex-shrink: 0;
    }

    @media (min-width: 768px) {
        padding: 20px;
    }

    @media (max-width: 768px) {
        margin: 20px 0;

        & + & {
            border-left: 1px solid ${colors.border};
            padding-left: 30px;
        }

        button,
        a {
            display: none;
        }
    }
`;

const InlineStats = styled(FlexBase)`
    padding-right: 30px;

    div + div {
        margin-left: 45px;
    }

    @media (max-width: 768px) {
        div:nth-child(2) {
            display: none;
        }
    }
`;

const MobileActions = styled.div`
    button {
        display: block;
        width: 100%;
    }

    a + button,
    a + a {
        margin-top: 16px;
    }

    @media (min-width: 768px) {
        display: none;
    }
`;

const JazzIconContainer = styled.div`
    height: 80px;
    width: 80px;
    margin-right: 20px;
`;

const Header = styled.div`
  width: 50%;
  font-size: 20px;
  display: flex;
`;