import * as React from 'react';
import styled from 'styled-components';

import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';

interface WalletDetailProps {
    url: string;
    iconUrl: string;
    name: string;
}

const Container = styled.a`
    display: inline-flex;
    width: 100%;
    height: 60px;
    align-items: center;
    margin-bottom: 30px;
    border: 1px solid ${colors.border};
    padding: 22px 20px 20px;
    margin-right: 20px;
`;

const WalletDetailIcon = styled.img`
    width: 30px;
    height: 30px;
    background-color: ${colors.walletBoxShadow};
    text-align: center;
    color: ${colors.white};
    font-weight: 300;
    display: inline-block;
    margin-right: 10px;
    overflow: hidden;
    &:last-child {
        margin-right: 0;
    }
`;

export const WalletDetail: React.FC<WalletDetailProps> = ({ url, iconUrl, name}) => {
    return (
        <Container href={url}>
          <WalletDetailIcon src={iconUrl} alt={iconUrl} />
          <Paragraph color={colors.textDarkPrimary}>
            {name}
          </Paragraph>
        </Container>
    );
};
