import moment from 'moment';
import React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Jazzicon, generateUniqueId } from 'ts/components/ui/jazzicon';
import { UnorderedList, ListItem } from 'ts/components/textList';
import { colors } from 'ts/style/colors';
import { WebsitePaths } from 'ts/types';

interface IVotingPowerInputProps {
  userZRXBalance: number;
  onOpenConnectWalletDialog: () => void;
  onNextButtonClick: () => void;
  address: string
}

interface IRegistrationSuccess {
  nextEpochStart: Date;
}

const ConnectWalletButton = styled(Button)``;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    align-items: flex-start;
    flex-direction: column;

    @media (min-width: 480px) {
        flex-direction: row;
    }

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
    }

    @media (min-width: 900px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 1140px) {
        flex-direction: row;
        align-items: center;
    }
`;

const Container = styled.div`
    margin-bottom: 60px;
    border: 1px solid #dddddd;
    background-color: ${() => colors.white};
    padding: 10px 20px;
    display: flex;
    align-items: center;
    height: 80px;
`;

const Heading = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
`;

const JazzIconContainer = styled.div`
    height: 40px;
    width: 40px;
    margin-right: 20px;
    border: 1px solid #dddddd;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Input = styled.input`
  color: ${colors.textDarkSecondary};
  font-size: 16px;
  padding-bottom: 3px;
  border: none;
  background: none;
  text-align: right;
  margin: 0 5px;
  outline: none;
  height: 100%;
  width: 99%;

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  [type=number] {
    -moz-appearance: textfield;
  }
`;

const Title = styled.h3`
    font-size: 18px;
    line-height: 1.34;
    margin-right: 5px;

    @media (min-width: 768px) {
        font-size: 22px;
    }
`;

const ZRXAmount = styled.span`
    color: ${colors.textDarkSecondary};
    font-size: 16px;
    margin-right: 15px;
    flex: 1;
    display: flex;
    align-items: center;
`;

const Notice = styled.div`
  display: flex;
  align-items: center;
  margin-top: 80px;
`;

const Bullet = styled.div`
  height: 10px;
  width: 15px;
  margin-right: 15px;
  background-color: #000000;
`;

const ConfirmButton = styled(Button)`
  margin-top: 40px;
  color: ${() => colors.white};
`;

export const VotingPowerInput: React.FC<IVotingPowerInputProps> = ({ userZRXBalance, onOpenConnectWalletDialog, address, onNextButtonClick }) => {
  return (
    <>
    {
      !!userZRXBalance ?
      <>
        <InfoHeader>
            Your voting power
        </InfoHeader>
        <Container>
            <Heading>
                <JazzIconContainer>
                    <Jazzicon isSquare={true} diameter={28}  seed={address && generateUniqueId(address)} />
                </JazzIconContainer>
                <Title>
                    You
                </Title>
                <ZRXAmount><Input type="number" defaultValue={userZRXBalance} /> ZRX</ZRXAmount>
            </Heading>
          </Container>
          <Notice>
            <Bullet />
            <span><strong>Your ZRX will be locked for 1-2 weeks</strong>, depending amount of time remaining in the current epoch</span>
          </Notice>
          <ConfirmButton onClick={onNextButtonClick}>
            Confirm Registration
          </ConfirmButton>
      </>
      :
      <ConnectWalletButton color={colors.white} onClick={onOpenConnectWalletDialog}>
          Connect your wallet to register to vote
      </ConnectWalletButton>
    }</>
  );
};

const Header = styled.h1`
    font-size: 36px;
    font-weight: 300;
    line-height: 1.1;
    margin-bottom: 60px;
    text-align: center;
`;

const SuccessContainer = styled.div`
  background-color: ${() => colors.white};
  border: 1px solid #dddddd;
  padding: 50px;
`;

const MessageList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  padding: 0 50px;

  li {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    line-height: 20px;
    color: ${() => colors.textDarkSecondary};
    font-size: 12px;
    
    strong {
      color: #000000;
      font-weight: bold;
      font-size: 14px;
    }
  }
`;

export const RegistrationSuccess: React.FC<IRegistrationSuccess> = ({ nextEpochStart }) => {
  console.log(nextEpochStart);
  const nextEpochMoment = moment(nextEpochStart);
  const todayMoment = moment();
  const daysToNextEpoch = nextEpochMoment.diff(todayMoment, 'days');
  return (
    <SuccessContainer>
      <Header>
        Your voting power is now registered
      </Header>

      {/* <InfoHeader>Your tokens are now locked.</InfoHeader>

      <InfoHeader>Additional tip</InfoHeader> */}

    <MessageList>
      <li>
        <strong>Your tokens are now locked.</strong>
        Unlocking will be available in {daysToNextEpoch} days
      </li>
      <li>
        <strong>Additional tip</strong>
        Unlocking will be available in {daysToNextEpoch} days
      </li>
    </MessageList>
    </SuccessContainer>
  )
};