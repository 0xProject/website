import * as React from 'react';
import styled from 'styled-components';

import { DialogContent, DialogOverlay } from '@reach/dialog';

import { Button } from 'ts/components/button';
import { ButtonClose } from 'ts/components/modals/button_close';
import { Heading, Paragraph } from 'ts/components/text';

import { colors } from 'ts/style/colors';

interface Props {
  isOpen?: boolean;
  onDismiss?: () => void;
}

export const StakingConfirmationDialog: React.FunctionComponent<Props> = ({
  isOpen,
  onDismiss,
}) => {
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
          marginBottom="20px"
        >
          Staking Confirmation
        </Heading>

        <Paragraph isMuted={false} color={colors.textDarkSecondary}>
          This will lock your tokens.  To unlock, you will need to remove your stake and wait until the epoch after next before withdrawal is available.
        </Paragraph>
        <Paragraph isMuted={true} color={colors.textDarkPrimary}>
          Unlocking will take between 2-4 weeks (1-2 Epochs)
        </Paragraph>
        <Paragraph isMuted={true} color={colors.textDarkPrimary}>
          50% of your ZRX voting power will go to the owner(s) of the staking pool(s)
        </Paragraph>
        <ButtonClose onClick={onDismiss} />
        <Button  onClick={onDismiss} isInline={true} isFullWidth={true} color={colors.white}>
            I understand, Stake my ZRX
        </Button>
      </StyledDialogContent>
    </DialogOverlay>
  );
};

const StyledDialogContent = styled(DialogContent)`
    position: relative;
    max-width: 800px;
    background-color: #f6f6f6 !important;
    padding: 60px 60px !important;

    @media (max-width: 768px) {
        width: calc(100vw - 40px) !important;
        margin: 40px auto !important;
        padding: 30px 30px !important;
    }
`;
