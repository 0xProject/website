import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Heading } from 'ts/components/text';
// TODO(kimpers): New providers needed!
import { Providers } from 'ts/types';
import { constants } from 'ts/utils/constants';

// TODO: move into util?
const providerToName: { [provider: string]: string } = {
    [Providers.Metamask]: constants.PROVIDER_NAME_METAMASK,
    [Providers.Parity]: constants.PROVIDER_NAME_PARITY_SIGNER,
    [Providers.Mist]: constants.PROVIDER_NAME_MIST,
    [Providers.CoinbaseWallet]: constants.PROVIDER_NAME_COINBASE_WALLET,
    [Providers.Cipher]: constants.PROVIDER_NAME_CIPHER,
};

const StyledDialogContent = styled(DialogContent)`
    width: 571px;
    height: 528px;
    background: #ffffff;
    border: 1px solid #e5e5e5;
`;

const WalletProviderButton = styled(Button).attrs({
    borderColor: '#d9d9d9',
    borderRadius: '0px',
    isTransparent: true,
})`
    height: 70px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px;
`;

const Divider = styled.div`
    height: 40px;
    border-left: 1px solid #d9d9d9;
    width: 0px;
    margin: 0 15px;
`;

interface IWalletCategoryProps {
    title: string;
    provider: Providers;
    onClick: () => void;
}

const WalletCategory = ({ title, provider, onClick }: IWalletCategoryProps) => {
    return (
        <div>
            <Heading asElement="h5" color="#5C5C5C" size={20} marginBottom="15px">
                {title}
            </Heading>
            <WalletProviderButton onClick={onClick}>
                <Icon name={`${provider.toLowerCase()}_icon`} size={30} />
                <Divider />
                <Heading asElement="h5" size={20} marginBottom="0px">
                    {providerToName[provider]}
                </Heading>
            </WalletProviderButton>
        </div>
    );
};

export const ConnectWalletDialog = () => {
    return (
        <DialogOverlay isOpen={true} style={{ background: 'none' }}>
            <StyledDialogContent>
                <Heading asElement="h3" size={34}>
                    Connect a wallet
                </Heading>
                <WalletCategory
                    title="Detected wallet"
                    provider={Providers.Metamask}
                    onClick={() => console.log('Clicked on wallet provider')}
                />
            </StyledDialogContent>
        </DialogOverlay>
    );
};
