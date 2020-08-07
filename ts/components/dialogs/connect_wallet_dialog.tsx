import { DialogContent, DialogOverlay } from '@reach/dialog';
import '@reach/dialog/styles.css';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector';
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

import { useEdgerConnect, useInactiveListener } from 'ts/hooks/use_web3';
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
        background: ${(props) => props.theme.bgColor};
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
    border: ${props => props.isConnected && `1px solid #00AE99`}
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
    connector: any;
    isConnected: boolean;
}
const WalletOption = ({ name, onClick, connector, isConnected }: WalletOptionProps) => {
    const iconName = utils.getProviderIcon(connector);

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
    grid-template-columns: 1fr 1fr;
    max-width: 30rem;
    margin: auto;
`;

export const ConnectWalletDialog = () => {
    const isOpen = useSelector((state: State) => state.isConnectWalletDialogOpen);
    const { connector, activate, error } = useWeb3React();
    const [activatingConnector, setActivatingConnector] = useState<any>();

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined);
        }
    }, [activatingConnector, connector]);

    const isTriedEager = useEdgerConnect();

    useInactiveListener(!isTriedEager || !!activatingConnector);

    const dispatch = useDispatch();
    const [dispatcher, setDispatcher] = useState<Dispatcher | undefined>(undefined);
    useEffect(() => {
        setDispatcher(new Dispatcher(dispatch));
    }, [dispatch]);

    const onCloseDialog = useCallback(() => dispatcher.updateIsConnectWalletDialogOpen(false), [dispatcher]);

    return (
        <StyledDialogOverlay isOpen={isOpen}>
            <StyledDialogContent>
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
                            const currentConnector = constants.SUPPORTED_WALLETS[key].connector;
                            const isConnected = currentConnector === connector;

                            return (
                                <WalletOption
                                    key={`wallet-button-${key}`}
                                    name={constants.SUPPORTED_WALLETS[key].name}
                                    connector={currentConnector}
                                    isConnected={isConnected}
                                    onClick={() => {
                                        setActivatingConnector(currentConnector);
                                        activate(currentConnector);
                                        onCloseDialog();
                                    }}
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
