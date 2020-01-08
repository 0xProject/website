import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Heading, Paragraph } from 'ts/components/text';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { zIndex } from 'ts/style/z_index';
import { AccountState, Providers } from 'ts/types';
import { utils } from 'ts/utils/utils';

import { useWallet } from 'ts/hooks/use_wallet';

const StyledDialogOverlay = styled(DialogOverlay)`
    &[data-reach-dialog-overlay] {
        background: none;
        z-index: ${zIndex.overlay};

        @media (max-width: 768px) {
            background: white;
        }
    }
`;

const StyledDialogContent = styled(DialogContent)`
    &[data-reach-dialog-content] {
        width: 571px;
        background: ${props => props.theme.bgColor};
        border: 1px solid #e5e5e5;

        @media (max-width: 768px) {
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 30px;

            border: none;
        }
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

const ButtonClose = styled(Button)`
    width: 18px;
    height: 18px;
    border: none;

    path {
        fill: ${colors.black};
    }
`;

const ButtonBack = styled(Button)`
    width: 22px;
    height: 17px;
    border: none;

    path {
        fill: ${colors.backgroundDark};
    }
`;

const HeadingRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;

    height: 42px;
    @media (max-width: 768px) {
        height: 38px;
    }

    /* Heading */
    h3 {
        font-size: 34px;

        @media (max-width: 768px) {
            font-size: 28px;
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

interface WalletCategoryProps {
    title: string;
    providers: ProviderInfo[];
}

const IconIfExists = ({ provider }: { provider: ProviderInfo }) => {
    if (provider.icon) {
        return (
            <>
                {provider.icon}
                <Divider />
            </>
        );
    }

    const iconName = utils.getProviderTypeIcon(provider.providerType);

    if (iconName) {
        return (
            <>
                <Icon name={iconName} size={30} />
                <Divider />
            </>
        );
    }

    return null;
};

const WalletCategory = ({ title, providers }: WalletCategoryProps) => {
    return (
        <WalletCategoryStyling>
            <Heading asElement="h5" color={colors.textDarkSecondary} size={20} marginBottom="15px">
                {title}
            </Heading>
            <div>
                {providers.map(provider => (
                    <WalletProviderButton onClick={provider.onClick} key={provider.name}>
                        <IconIfExists provider={provider} />
                        <div style={{ textAlign: 'left' }}>
                            <Heading asElement="h5" size={20} marginBottom="0">
                                {provider.name}
                            </Heading>
                            {provider.description && (
                                <Paragraph size="small" color="#898990" marginBottom="0">
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

const Arrow = () => (
    <svg
        style={{
            transform: 'rotate(180deg)',
        }}
        color={colors.backgroundDark}
        width="22"
        height="17"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M13.066 0l-1.068 1.147 6.232 6.557H0v1.592h18.23l-6.232 6.557L13.066 17l8.08-8.5-8.08-8.5z" />
    </svg>
);

const DashboardUrlWrapper = styled.div`
    height: 70px;
    background: ${colors.backgroundLight};
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: all;
`;

interface OtherWalletScreenProps {
    onDismiss: () => void;
    onGoBack: () => void;
}

const OtherWalletScreen = ({ onDismiss, onGoBack }: OtherWalletScreenProps) => (
    <>
        <HeadingRow>
            <ButtonBack isTransparent={true} isNoBorder={true} padding="0px" onClick={onGoBack}>
                <Arrow />
            </ButtonBack>
            <ButtonClose isTransparent={true} isNoBorder={true} padding="0px" onClick={onDismiss}>
                <Icon name="close-modal" />
            </ButtonClose>
        </HeadingRow>
        <Heading asElement="h5" color={colors.textDarkSecondary} size={20} marginBottom="15px">
            Other mobile wallets
        </Heading>
        <Paragraph size={20} color={colors.textDarkPrimary}>
            Please open the link in your mobile wallet.
        </Paragraph>
        <DashboardUrlWrapper>
            <Paragraph size={20} color={colors.textDarkPrimary} marginBottom="0">
                https://0x.org/dashboard
            </Paragraph>
        </DashboardUrlWrapper>
    </>
);

interface ProviderInfo {
    name: string;
    providerType?: Providers;
    description?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

interface WalletProviderCategory {
    title: string;
    providers: ProviderInfo[];
}

export const ConnectWalletDialog = () => {
    const isOpen = useSelector((state: State) => state.isConnectWalletDialogOpen);
    const providerState = useSelector((state: State) => state.providerState);

    const dispatch = useDispatch();
    const [dispatcher, setDispatcher] = useState<Dispatcher | undefined>(undefined);
    useEffect(() => {
        setDispatcher(new Dispatcher(dispatch));
    }, [dispatch]);

    const [shouldShowOtherWallets, setShouldShowOtherWallets] = useState<boolean>(false);
    const [walletProviders, setWalletProviders] = useState<WalletProviderCategory[]>([]);

    const isMobile = utils.isMobileOperatingSystem();

    const onGoBack = useCallback(() => setShouldShowOtherWallets(false), []);
    const onCloseDialog = useCallback(() => dispatcher.updateIsConnectWalletDialogOpen(false), [dispatcher]);

    const { connectToWallet } = useWallet();

    useEffect(() => {
        const _walletProviders: WalletProviderCategory[] = [];

        if (providerState.account.state !== AccountState.None) {
            _walletProviders.push({
                title: 'Detected wallet',
                providers: [
                    {
                        name: providerState.displayName,
                        providerType: providerState.providerType,
                        onClick: () => {
                            connectToWallet();
                            onCloseDialog();
                        },
                    },
                ],
            });
        }

        if (isMobile) {
            _walletProviders.push({
                title: 'Mobile wallet',
                providers: [
                    {
                        name: 'Other mobile wallets',
                        icon: (
                            <div style={{ position: 'relative', height: '30px', width: '30px', display: 'flex' }}>
                                <IconPlus />
                            </div>
                        ),
                        onClick: () => setShouldShowOtherWallets(true),
                    },
                ],
            });
        }

        setWalletProviders(_walletProviders);
    }, [
        connectToWallet,
        isMobile,
        onCloseDialog,
        providerState.account.state,
        providerState.displayName,
        providerState.providerType,
    ]);

    return (
        <StyledDialogOverlay isOpen={isOpen}>
            <StyledDialogContent>
                {shouldShowOtherWallets ? (
                    <OtherWalletScreen onDismiss={onCloseDialog} onGoBack={onGoBack} />
                ) : (
                    <>
                        <HeadingRow>
                            <Heading asElement="h3" marginBottom="0">
                                Connect a wallet
                            </Heading>
                            <ButtonClose isTransparent={true} isNoBorder={true} padding="0px" onClick={onCloseDialog}>
                                <Icon name="close-modal" />
                            </ButtonClose>
                        </HeadingRow>
                        {walletProviders.length ? (
                            walletProviders.map(({ title, providers }, i) => (
                                <WalletCategory key={`wallet-category-${i}`} title={title} providers={providers} />
                            ))
                        ) : (
                            <Heading asElement="h5" size={20} marginBottom="0">
                                No wallet found
                            </Heading>
                        )}
                    </>
                )}
            </StyledDialogContent>
        </StyledDialogOverlay>
    );
};
