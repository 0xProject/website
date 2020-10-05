// tslint:disable:no-floating-promises
// tslint:disable:no-await-promise
// tslint:disable:no-promise-function-async
// tslint:disable:no-shadowed-variable
// tslint:disable:prefer-conditional-expression
import { logUtils } from '@0x/utils';
import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
    InjectedConnector,
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
    WalletConnectConnector,
} from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { Heading } from 'ts/components/text';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { zIndex } from 'ts/style/z_index';
import { utils } from 'ts/utils/utils';

import { injected, resetWalletConnect, resetWalletLink, walletconnect, walletlink } from 'ts/connectors';
import { useEagerConnect, useInactiveListener } from 'ts/hooks/use_web3';
import { WalletProvider } from 'ts/types';
import { constants } from 'ts/utils/constants';

function getErrorMessage(error: Error): string {
    if (error instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network.";
    } else if (
        error instanceof UserRejectedRequestErrorInjected ||
        error instanceof UserRejectedRequestErrorWalletConnect
    ) {
        return 'Please authorize this website to access your Ethereum account.';
    } else {
        return 'An unknown error occurred. Check the console for more details.';
    }
}

const StyledDialogOverlay = styled(DialogOverlay)`
    &[data-reach-dialog-overlay] {
        background-color: rgba(0, 0, 0, 0.75);
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
    isConnected: false,
})`
    border: ${props => props.isConnected && `1px solid #00AE99`};
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
    /* Provider buttons wrapper */
    & > div {
        display: flex;
        flex-direction: row;

        @media (max-width: 768px) {
            flex-direction: column;
        }
    }
`;

interface WalletOptionProps {
    name?: string;
    onClick?: () => void;
    connector?: any;
    isConnected?: boolean;
    href?: string;
    type?: string;
}
const WalletOption = ({ name, onClick, isConnected, type }: WalletOptionProps) => {
    const iconName = utils.getProviderIcon(type);

    return (
        <WalletCategoryStyling>
            <WalletProviderButton isConnected={isConnected} onClick={onClick}>
                {iconName && (
                    <>
                        <Icon name={iconName} size={30} />
                        <Divider />{' '}
                    </>
                )}
                <div style={{ textAlign: 'left' }}>
                    <Heading asElement="h5" size={20} marginBottom="0">
                        {name}
                    </Heading>
                </div>
            </WalletProviderButton>
        </WalletCategoryStyling>
    );
};

const StyledProviderOptions = styled.div`
    display: grid;
    grid-gap: 1rem;
    max-width: 30rem;
    margin: auto;
    @media (max-width: 768px) {
        grid-template-rows: 1fr;
    }
    @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
    }
`;

export const ConnectWalletDialog = () => {
    const isOpen = useSelector((state: State) => state.isConnectWalletDialogOpen);
    const isMetamask = window.ethereum && window.ethereum.isMetaMask ? true : false;
    const { connector, activate, error, account } = useWeb3React();
    const [activatingConnector, setActivatingConnector] = useState<any>();

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    const isTriedEager = useEagerConnect();

    useInactiveListener(!isTriedEager || !!activatingConnector);

    const dispatch = useDispatch();
    const [dispatcher, setDispatcher] = useState<Dispatcher | undefined>(undefined);
    useEffect(() => {
        setDispatcher(new Dispatcher(dispatch));
    }, [dispatch]);

    const onCloseDialog = useCallback(() => dispatcher.updateIsConnectWalletDialogOpen(false), [dispatcher]);

    const handleAccount = async (currentConnector: AbstractConnector, option: any) => {
        let address: string = '';
        try {
            await activate(currentConnector, undefined, true);
            setActivatingConnector(currentConnector);
            if (account) {
                const provider = await currentConnector.getProvider();
                if (option.type === 'WALLET_CONNECT') {
                    address = provider.accounts[0];
                } else {
                    address = provider._addresses ? provider._addresses[0] : provider.selectedAddress;
                }
                const data: WalletProvider = {
                    name: option.type,
                    address,
                };
                if (provider.isMetaMask) {
                    data.icon = 'METAMASK';
                } else if (provider.isWalletLink) {
                    data.icon = 'WALLET_LINK';
                } else if (provider.isWalletConnect) {
                    data.icon = 'WALLET_CONNECT';
                }
                if (typeof window !== undefined) {
                    window.localStorage.setItem('WALLETCONNECTOR', JSON.stringify(data));
                }
                dispatcher.updateWalletStateFromStorage();
                onCloseDialog();
            }
        } catch (error) {
            logUtils.warn(error);
            setActivatingConnector(undefined);
            if (currentConnector === walletconnect) {
                resetWalletConnect();
            } else if (currentConnector === walletlink) {
                resetWalletLink();
            }
            onCloseDialog();
        }
        // await activate(currentConnector, undefined, true).catch(error => {
        //     dispatcher.updateIsConnectWalletDialogOpen(true);
        // if (currentConnector === walletconnect) {
        //     resetWalletConnect();
        // } else if (currentConnector === walletlink) {
        //     resetWalletLink();
        // }
        // });
        // setActivatingConnector(currentConnector);
        // if (account) {
        //     onCloseDialog();
        //     const provider = await currentConnector.getProvider();

        //     if (option.type === 'WALLET_CONNECT') {
        //         address = provider.accounts[0];
        //     } else {
        //         address = provider._addresses ? provider._addresses[0] : provider.selectedAddress;
        //     }
        //     const data: WalletProvider = {
        //         name: option.type,
        //         address,
        //     };
        //     if (provider.isMetaMask) {
        //         data.icon = 'METAMASK';
        //     } else if (provider.isWalletLink) {
        //         data.icon = 'WALLET_LINK';
        //     } else if (provider.isWalletConnect) {
        //         data.icon = 'WALLET_CONNECT';
        //     }
        //     if (typeof window !== undefined) {
        //         window.localStorage.setItem('WALLETCONNECTOR', JSON.stringify(data));
        //     }
        //     dispatcher.updateWalletStateFromStorage();
        // }
    };

    return (
        <StyledDialogOverlay isOpen={isOpen}>
            <StyledDialogContent aria-label="Connect a wallet">
                <HeadingRow>
                    <Heading asElement="h3" marginBottom="0">
                        Connect a wallet
                    </Heading>
                    <ButtonClose isTransparent={true} isNoBorder={true} padding="0px" onClick={onCloseDialog}>
                        <Icon name="close-modal" />
                    </ButtonClose>
                </HeadingRow>
                <StyledProviderOptions>
                    {constants.SUPPORTED_WALLETS ? (
                        Object.keys(constants.SUPPORTED_WALLETS).map(key => {
                            const option = constants.SUPPORTED_WALLETS[key];
                            let currentConnector: WalletConnectConnector | WalletLinkConnector | InjectedConnector;
                            if (option.type === 'WALLET_CONNECT') {
                                currentConnector = walletconnect;
                            } else if (option.type === 'WALLET_LINK') {
                                currentConnector = walletlink;
                            } else {
                                currentConnector = injected;
                            }
                            const isConnected = currentConnector === connector;

                            if (currentConnector === injected) {
                                if (!(window.web3 || window.ethereum)) {
                                    if (option.name === 'Metamask') {
                                        return null;
                                    } else {
                                        return null;
                                    }
                                } else if (option.name === 'Metamask' && !isMetamask) {
                                    return null;
                                } else if (option.name === 'Detected' && isMetamask) {
                                    return null;
                                } else if (option.name === 'Detected' && utils.checkWindowProviderProperty('imToken')) {
                                    return (
                                        <WalletOption
                                            key={`wallet-button-${key}`}
                                            name="imToken"
                                            connector={currentConnector}
                                            isConnected={isConnected}
                                            type="imToken"
                                            onClick={async () => handleAccount(currentConnector, option)}
                                        />
                                    );
                                } else if (option.name === 'Detected' && utils.checkWindowProviderProperty('isTrust')) {
                                    return (
                                        <WalletOption
                                            key={`wallet-button-${key}`}
                                            name="Trust Wallet"
                                            connector={currentConnector}
                                            isConnected={isConnected}
                                            type="isTrust"
                                            onClick={async () => handleAccount(currentConnector, option)}
                                        />
                                    );
                                } else if (
                                    option.name === 'Detected' &&
                                    utils.checkWindowProviderProperty('isStatus')
                                ) {
                                    return (
                                        <WalletOption
                                            key={`wallet-button-${key}`}
                                            name="Status Wallet"
                                            connector={currentConnector}
                                            isConnected={isConnected}
                                            type="isStatus"
                                            onClick={async () => handleAccount(currentConnector, option)}
                                        />
                                    );
                                } else if (option.name === 'Detected' && utils.checkWindowProviderProperty('SOFA')) {
                                    return (
                                        <WalletOption
                                            key={`wallet-button-${key}`}
                                            name="Coinbase Wallet"
                                            connector={currentConnector}
                                            isConnected={isConnected}
                                            type="SOFA"
                                            onClick={async () => handleAccount(currentConnector, option)}
                                        />
                                    );
                                } else if (option.name === 'Detected' && utils.checkWindowProviderProperty('CIPHER')) {
                                    return (
                                        <WalletOption
                                            key={`wallet-button-${key}`}
                                            name="Cipher Wallet"
                                            connector={currentConnector}
                                            isConnected={isConnected}
                                            type="CIPHER"
                                            onClick={async () => handleAccount(currentConnector, option)}
                                        />
                                    );
                                } else if (option.name === 'Detected' && utils.checkWindowProviderProperty('Opera')) {
                                    return (
                                        <WalletOption
                                            key={`wallet-button-${key}`}
                                            name="Opera Wallet"
                                            connector={currentConnector}
                                            isConnected={isConnected}
                                            type="Opera"
                                            onClick={async () => handleAccount(currentConnector, option)}
                                        />
                                    );
                                } else if (option.name === 'Detected' && utils.checkWindowProviderProperty('Bitpie')) {
                                    return (
                                        <WalletOption
                                            key={`wallet-button-${key}`}
                                            name="Bitpie"
                                            connector={currentConnector}
                                            isConnected={isConnected}
                                            type="BITPIE"
                                            onClick={async () => handleAccount(currentConnector, option)}
                                        />
                                    );
                                }
                            }
                            return (
                                <WalletOption
                                    key={`wallet-button-${key}`}
                                    name={option.name}
                                    connector={currentConnector}
                                    isConnected={isConnected}
                                    type={option.type}
                                    onClick={async () => handleAccount(currentConnector, option)}
                                />
                            );
                        })
                    ) : (
                        <Heading asElement="h5" size={20} marginBottom="0">
                            {!!error && getErrorMessage(error)}
                        </Heading>
                    )}
                </StyledProviderOptions>
            </StyledDialogContent>
        </StyledDialogOverlay>
    );
};
