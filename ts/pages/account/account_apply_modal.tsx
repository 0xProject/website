import * as React from 'react';
import styled from 'styled-components';
import { DialogContent, DialogOverlay } from '@reach/dialog';

import { Button } from 'ts/components/button';
import { ButtonClose } from 'ts/components/modals/button_close';
import { Input } from 'ts/components/modals/input';
import { Heading, Paragraph } from 'ts/components/text';

import { colors } from 'ts/style/colors';

interface Props {
  isOpen?: boolean;
  onDismiss?: () => void;
}

interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
}

export const AccountApplyModal: React.FunctionComponent<Props> = ({
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
          marginBottom="20px"
        >
          Apply for staking node
        </Heading>

        <Paragraph isMuted={true} color={colors.textDarkPrimary}>
            Your vote will help to decide the future of the protocol. You will be receiving a custom
          “I voted” NFT as a token of our appreciation.
        </Paragraph>
        
        <InputWrap onSubmit={onSubmit}>
          <Input width="half" label="Your name" />
          <Input width="half" label="Your email" />
          <Input width="full" label="Name of your project/company" />
          <Input width="full" label="Do you have any documentation or a website?" placeholder="example.com" type="url" />
          <Input width="full" label="Anything else?" type="textarea" />

          <footer>
            <ButtonBack onClick={onDismiss}>
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.41917 15.6953L8.40025 14.6807L2.67727 8.88297L19.417 8.88297L19.417 7.47494L2.67727 7.47494L8.40025 1.6772L7.41917 0.662593L-0.000271501 8.17895L7.41917 15.6953Z" fill="#5C5C5C"/>
              </svg>

              Back
            </ButtonBack>
            
            <Button type="submit">
              Submit
            </Button>
          </footer>
        </InputWrap>

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

const InputWrap = styled.form<FormProps>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    margin-bottom: 30px;
  }

  footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
`;

const ButtonBack = styled.button`
  appearance: none;
  background: none;
  border: 0;
  font: inherit;
  color: ${colors.textDarkSecondary};
  display: flex;
  align-items: center;

  svg {
    margin-right: 15px;
  }

  cursor: pointer;
`;