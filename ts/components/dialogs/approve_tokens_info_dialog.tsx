import * as React from 'react';
import styled from 'styled-components';

import { DialogContent, DialogOverlay } from '@reach/dialog';

import { Button } from 'ts/components/button';
import { ButtonClose } from 'ts/components/modals/button_close';
import { Heading, Paragraph } from 'ts/components/text';

import { colors } from 'ts/style/colors';
import { zIndex } from 'ts/style/z_index';

interface Props {
    isOpen?: boolean;
    onDismiss?: () => void;
    onButtonClick?: () => void;
}

// An informational popup telling users to approve permissions from their wallet
export const ApproveTokensInfoDialog: React.FunctionComponent<Props> = ({ isOpen, onDismiss, onButtonClick }) => {
    return (
        <DialogOverlay
            style={{ background: 'rgba(255, 255, 255, 0.8)', zIndex: zIndex.overlay }}
            isOpen={isOpen}
            onDismiss={onDismiss}
        >
            <StyledDialogContent>
                <Heading asElement="h3" fontWeight="400" marginBottom="20px">
                    Unlock Your ZRX
                </Heading>
                <Paragraph isMuted={false} color={colors.textDarkSecondary}>
                    In order to stake you ZRX tokens you must first grant permissions to the 0x Staking Proxy contract. This will allow the contract to transfer the ZRX tokens you decide to stake, and start earning rewards.
                </Paragraph>
                <Paragraph isMuted={false} color={colors.textDarkSecondary}>
                    You should have seen a message appearing in your web wallet. Please confirm to continue, then you can close this pop-up. You will receive confirmation once the transaction is mined so you can proceed staking.
                </Paragraph>
                <ButtonClose onClick={onDismiss} />
                <Button onClick={onButtonClick} isInline={true} isFullWidth={true} color={colors.white}>
                    I approved the transaction in my web wallet
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
