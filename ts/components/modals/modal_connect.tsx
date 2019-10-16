import * as React from 'react';
import styled from 'styled-components';

import { DialogContent, DialogOverlay } from '@reach/dialog';

import { ButtonClose } from 'ts/components/modals/button_close';
import { WalletDetail } from 'ts/components/staking/wallet_detail';
import { Heading, Paragraph } from 'ts/components/text';

import { colors } from 'ts/style/colors';

interface Props {
  isOpen?: boolean;
  onDismiss?: () => void;
}

export const ModalConnect: React.FunctionComponent<Props> = ({
  isOpen,
  onDismiss,
}) => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    alert('submit!');
  };

  return (
    <DialogOverlay
        style={{ background: 'rgba(255, 255, 255, 0.8)', zIndex: 30 }}
        isOpen={isOpen}
        onDismiss={onDismiss}
    >
      <StyledDialogContent>
        <Heading
          asElement="h3"
          fontWeight="400"
          marginBottom="30px"
        >
          Connect a Wallet
        </Heading>
        <Paragraph marginBottom="10px" isMuted={false} color={colors.textDarkSecondary}>
          Detected wallet
        </Paragraph>
        <StyledWalletContent>
          <WalletDetail
            iconUrl={'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg'}
            url={'/'}
            name={'Metamask'}
          />
        </StyledWalletContent>
        <Paragraph marginBottom="10px" isMuted={false} color={colors.textDarkSecondary}>
          Hardware Wallets
        </Paragraph>
        <StyledWalletContent>
          <WalletDetail
            iconUrl={'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg'}
            url={'/'}
            name={'Metamask'}
          />
          <WalletDetail
            iconUrl={'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg'}
            url={'/'}
            name={'Trezor'}
          />
        </StyledWalletContent>
        <Paragraph marginBottom="10px" isMuted={false} color={colors.textDarkSecondary}>
          Mobile Wallets
        </Paragraph>
        <StyledWalletContent>
          <WalletDetail
            iconUrl={'https://cdn.worldvectorlogo.com/logos/0x-virtual-money-.svg'}
            url={'/'}
            name={'Metamask'}
          />
        </StyledWalletContent>
        <ButtonClose onClick={onDismiss} />
      </StyledDialogContent>
    </DialogOverlay>
  );
};

const StyledDialogContent = styled(DialogContent)`
    position: relative;
    max-width: 800px;
    padding: 40px 40px !important;
    border: 1px solid ${colors.walletBoxShadow};

    @media (max-width: 768px) {
        width: calc(100vw - 40px) !important;
        margin: 40px auto !important;
        padding: 30px 30px !important;
    }
`;

const StyledWalletContent = styled.div`
  width: 100%;
  display: flex;
`;
