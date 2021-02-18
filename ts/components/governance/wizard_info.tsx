import React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Separator } from 'ts/components/docs/shared/separator';
import { ListItem, UnorderedList } from 'ts/components/textList';
import { colors } from 'ts/style/colors';
import { WebsitePaths } from 'ts/types';

const IntroHeader = styled.h1`
    font-size: 36px;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 15px;
    text-align: center;

    @media (min-width: 480px) {
        text-align: left;
    }

    @media (min-width: 768px) {
        font-size: 50px;
    }
`;

const IntroDescription = styled.h2`
    font-size: 18px;
    font-weight: 300;
    color: ${colors.textDarkSecondary};
    line-height: 1.44;
    margin-bottom: 30px;
    text-align: center;

    @media (min-width: 480px) {
        max-width: 350px;
        text-align: left;
    }

    @media (min-width: 768px) {
        margin-bottom: 60px;
    }
`;

const StyledUnorderedList = styled(UnorderedList as any)`
    width: 60%;
`;

export const StartRegistrationInfo = () => {
  return (
    <>
      <>
        <IntroHeader>Register your Vote</IntroHeader>
        <IntroDescription>Registering allows you to use ZRX to vote on treasury proposals.</IntroDescription>
      </>
      <Separator margin="0 120px 60px 0" />
      <StyledUnorderedList>
          <ListItem>50% of your voting power must go to the owner the staking pool.</ListItem>
          <ListItem>
              Change your delegation or vote for proposals at {' '}
              <Button to={WebsitePaths.Vote} isInline={true} isTransparent={true} isNoBorder={true} isNoPadding={true} color={colors.brandLight}>
                  https://0x.org/zrx/vote
              </Button>
          </ListItem>
      </StyledUnorderedList>
    </>
  );
};

export const RegistrationSuccessInfo = () => {
  return (
    <>
      <>
        <IntroHeader>Success</IntroHeader>
        <IntroDescription>Delegation allows you to use ZRX to vote on treasury proposals. </IntroDescription>
      </>
      <Separator margin="0 120px 60px 0" />
      <StyledUnorderedList>
          <ListItem>50% of your voting power must go to the owner the staking pool.</ListItem>
          <ListItem>
          You can manage your voting power delegations in your {' '}
              <Button to={WebsitePaths.Account} isInline={true} isTransparent={true} isNoBorder={true} isNoPadding={true} color={colors.brandLight}>
                account settings
              </Button>
          </ListItem>
      </StyledUnorderedList>
    </>
  );
};
