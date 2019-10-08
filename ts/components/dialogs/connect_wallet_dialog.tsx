import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Heading, Paragraph } from 'ts/components/text';
// TODO(kimpers): New providers needed!
import { Providers } from 'ts/types';
import { constants } from 'ts/utils/constants';

const StyledDialogContent = styled(DialogContent)`
    max-width: 571px;
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

    & + & {
        margin-left: 30px;
    }
`;

const Divider = styled.div`
    height: 40px;
    border-left: 1px solid #d9d9d9;
    width: 0px;
    margin: 0 15px;
`;

type ProviderType = 'INJECTED' | 'HARDWARE_WALLET' | 'WALLET_CONNECT';

interface IProviderInfo {
    name: string;
    id: string;
    description?: string;
}

const WalletCategoryStyling = styled.div`
    & + &  {
        margin-top: 30px;
    }
`;

interface IWalletCategoryProps {
    title: string;
    providers: IProviderInfo[];
    onClick: (id: string) => void;
}

const WalletCategory = ({ title, providers, onClick }: IWalletCategoryProps) => {
    return (
        <WalletCategoryStyling>
            <Heading asElement="h5" color="#5C5C5C" size={20} marginBottom="15px">
                {title}
            </Heading>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
            {providers.map(provider => (
                <WalletProviderButton onClick={() => onClick(provider.id)} key={provider.name}>
                    <Icon name={`${provider.id.toLowerCase()}_icon`} size={30} />
                    <Divider />
                    <div style={{textAlign: 'left'}}>
                        <Heading asElement="h5" size={20} marginBottom="0px">
                            {provider.name}
                        </Heading>
                        {provider.description && (
                            <Paragraph size="small" color="#898990" marginBottom="0px">{provider.description}</Paragraph>
                        )}
                    </div>
                </WalletProviderButton>
            ))}
            </div>
        </WalletCategoryStyling>
    );
};

const MOCK_DATA = [
    {
        title: 'Detected wallet',
        providers: [
            {
                name: 'MetaMask',
                id: Providers.Metamask,
            },
        ],
    },
    {
        title: 'Hardware wallets',
        providers: [
            {
                name: 'Trezor',
                id: 'TREZOR',
            },
            {
                name: 'Ledger',
                id: 'LEDGER',
            },
        ],
    },
    {
        title: 'Mobile wallets',
        providers: [
            {
                name: 'Wallet connect',
                id: 'wallet_connect',
                description: 'Walleth, Trust, Tokenary, Rainbow, Pillar, Argent, etc',
            },
        ],
    },
];

export const ConnectWalletDialog = () => {
    return (
        <DialogOverlay isOpen={true} style={{ background: 'none' }}>
            <StyledDialogContent>
            <Heading asElement="h3" size={34}>
                Connect a wallet
            </Heading>
                {MOCK_DATA.map(({ title, providers }) => (
                    <WalletCategory
                        title={title}
                        providers={providers}
                        onClick={(id: string) => console.log(`Clicked on wallet provider ${id}`)}
                    />
                )}
            </StyledDialogContent>
        </DialogOverlay>
    );
};
