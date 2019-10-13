import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';
import { zIndex } from 'ts/style/z_index';
// TODO(kimpers): New providers needed!
import { Providers } from 'ts/types';

const MainHeading = styled(Heading).attrs({
    asElement: 'h3',
    marginBottom: '0',
})`
    font-size: 34px !important;
    line-height: 42px !important;
    display: inline-block;

    @media (max-width: 768px) {
        font-size: 28px !important;
        line-height: 38px !important;
    }
`;

const StyledDialogOverlay = styled(DialogOverlay)`
    background: none !important;
    z-index: ${zIndex.overlay};

    @media (max-width: 768px) {
        background: white !important;
    }
`;

const StyledDialogContent = styled(DialogContent)`
    width: 571px !important;
    background: ${props => props.theme.bgColor};
    border: 1px solid #e5e5e5;

    @media (max-width: 768px) {
        height: 100vh !important;
        width: 100vw !important;
        margin: 0 !important;
        padding: 30px !important;

        border: none;
    }
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

    @media (min-width: 769px) {
        & + & {
            margin-left: 30px;
        }
    }

    @media (max-width: 768px) {
        & + & {
            margin-top: 15px;
        }
    }
`;

const HeadingRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;

    button {
        height: 18px;
        width: 18px;
    }

    figure {
        path {
            fill: ${colors.black};
        }
    }
`;

const Divider = styled.div`
    height: 40px;
    border-left: 1px solid #d9d9d9;
    width: 0px;
    margin: 0 15px;
`;

const WalletCategoryStyling = styled.div`
    & + & {
        margin-top: 30px;
    }

    /* Provider buttons wrapper */
    & > div {
        display: flex;
        flex-direction: row;

        @media (max-width: 768px) {
            flex-direction: column;
        }
    }
`;

interface IProviderInfo {
    name: string;
    id: string;
    description?: string;
    icon?: React.ReactNode;
}

interface IWalletCategoryProps {
    title: string;
    providers: IProviderInfo[];
    onClick: (id: string) => void;
}

const WalletCategory = ({ title, providers, onClick, icon }: IWalletCategoryProps) => {
    return (
        <WalletCategoryStyling>
            <Heading asElement="h5" color={colors.textDarkSecondary} size={20} marginBottom="15px">
                {title}
            </Heading>
            <div>
                {providers.map(provider => (
                    <WalletProviderButton onClick={() => onClick(provider.id)} key={provider.name}>
                        {provider.icon || <Icon name={`${provider.id.toLowerCase()}_icon`} size={30} />}
                        <Divider />
                        <div style={{ textAlign: 'left' }}>
                            <Heading asElement="h5" size={20} marginBottom="0px">
                                {provider.name}
                            </Heading>
                            {provider.description && (
                                <Paragraph size="small" color="#898990" marginBottom="0px">
                                    {provider.description}
                                </Paragraph>
                            )}
                        </div>
                    </WalletProviderButton>
                ))}
            </div>
        </WalletCategoryStyling>
    );
};

const MOCK_DATA_DESKTOP = [
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

const IconPlus = styled.div`
    position: relative;
    width: 15px;
    height: 15px;
    margin: auto;

    &:before,
    &:after {
        content: '';
        position: absolute;
        background-color: ${colors.black};
    }

    &:before {
        top: 0;
        left: 7px;
        width: 1px;
        height: 100%;
    }

    &:after {
        top: 7px;
        left: 0;
        width: 100%;
        height: 1px;
    }
`;

const MOCK_DATA_MOBILE = [
    {
        title: 'Mobile wallet',
        providers: [
            {
                name: 'Coinbase',
                id: Providers.CoinbaseWallet,
            },
            {
                name: 'Trust',
                id: Providers.TrustWallet,
            },
            {
                name: 'Other mobile wallets',
                id: 'OTHER_WALLETS',
                icon: (
                    <div style={{ position: 'relative', height: '30px', width: '30px', display: 'flex' }}>
                        <IconPlus />
                    </div>
                ),
            },
        ],
    },
    {
        title: 'Hardware wallets',
        providers: [
            {
                name: 'Ledger X',
                id: 'LEDGER',
            },
        ],
    },
];

interface IConnectWalletDialogProps {
    onDismiss: () => void;
}

export const ConnectWalletDialog = ({ onDismiss }: IConnectWalletDialogProps) => {
    return (
        <StyledDialogOverlay isOpen={true}>
            <StyledDialogContent>
                <HeadingRow>
                    <MainHeading>Connect a wallet</MainHeading>
                    <Button isTransparent={true} isNoBorder={true} padding="0px">
                        <Icon name="close-modal" />
                    </Button>
                </HeadingRow>
                {MOCK_DATA_MOBILE.map(({ title, providers }, i) => (
                    <WalletCategory
                        key={`wallet-category-${i}`}
                        title={title}
                        providers={providers}
                        onClick={(id: string) => alert(`Clicked on wallet provider ${id}`)}
                    />
                ))}
            </StyledDialogContent>
        </StyledDialogOverlay>
    );
};
