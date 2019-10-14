import * as React from 'react';
import styled from 'styled-components';
import { DialogContent, DialogOverlay } from '@reach/dialog';

import { ButtonClose } from 'ts/components/modals/button_close';
import { Heading, Paragraph } from 'ts/components/text';

import { colors } from 'ts/style/colors';

interface Props {
  isOpen?: boolean;
  onDismiss?: () => void;
}

export const AccountApplyModal: React.FunctionComponent<Props> = ({
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
          Apply for staking node
        </Heading>

        <Paragraph isMuted={true} color={colors.textDarkPrimary}>
            Your vote will help to decide the future of the protocol. You will be receiving a custom
            “I voted” NFT as a token of our appreciation.
        </Paragraph>

        <ButtonClose onClick={onDismiss} />
      </StyledDialogContent>
    </DialogOverlay>
  )
}

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