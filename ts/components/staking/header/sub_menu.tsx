import * as React from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';
import { constants } from 'ts/utils/constants';
import { utils } from 'ts/utils/utils';

const SubMenuWrapper = styled.div`
    display: flex;

    @media (min-width: 1200px) {
        cursor: pointer;
        width: 238px;
        height: 60px;
        border: 1px solid rgba(0, 0, 0, 0.4);
        position: relative;
        align-items: center;
    }

    @media (max-width: 1199px) {
        flex-direction: column;
        background: #e3e9e5;
    }
`;

const EthAddress = styled.span`
    font-size: 18px;
    font-feature-settings: 'tnum' on, 'lnum' on;
`;

const Arrow = ({ isExpanded }: { isExpanded?: boolean }) => (
    <svg
        style={{ transform: isExpanded ? 'rotate(180deg)' : null }}
        width="17"
        height="9"
        viewBox="0 0 17 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M16 1L8.5 8.5L1 1" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MenuItem = styled.span`
    font-size: 20px;
    height: 29px;
    color: #000000;

    @media (min-width: 1200px) {
        margin-left: 30px;
        & + & {
            margin-top: 20px;
        }

        &:hover {
            opacity: 0.5;
            transform: translate3d(0, 0, 0);
            transition: opacity 0.35s, transform 0.35s, visibility 0s;
        }
    }
`;

const ExpandedMenu = styled.div`
    width: 237px;
    height: 140px;
    background: ${colors.backgroundLightGrey};
    border: 1px solid rgba(92, 92, 92, 0.15);
    position: absolute;
    top: 73px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &:after {
        content: '';
        display: block;
        position: absolute;
        top: -5px;
        right: 12px;
        width: 8px;
        height: 8px;
        background: ${colors.backgroundLightGrey};
        border-right: 1px solid rgba(92, 92, 92, 0.15);
        border-bottom: 1px solid rgba(92, 92, 92, 0.15);
        transform: rotate(-135deg);
    }
`;

const WalletAddressWrapper = styled.div`
    display: flex;
    align-items: center;

    @media (min-width: 1200px) {
        justify-content: space-evenly;
        width: 100%;
    }

    @media (max-width: 1199px) {
        margin: 34px 0 19px 30px;
        * + * {
            margin-left: 20px;
        }
    }
`;

const MobileMenuWrapper = styled.div`
    display: flex;
    border-top: 1px solid #f3f6f4;
    margin: 0 30px 30px;
    padding-top: 30px;

    ${MenuItem} + ${MenuItem} {
        margin-left: 55px;
    }
`;

interface ISubMenuProps {
    openConnectWalletDialogCB: () => void;
}

const ConnectButton = styled(Button).attrs({
    isTransparent: true,
    borderColor: 'rgba(0, 0, 0, 0.4)',
})`
    color: ${colors.black};

    @media (max-width: 1199px) {
        margin: 30px;
        width: 315px;
    }
`;

export const SubMenu = (props: ISubMenuProps) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [activeAccount, setActiveAccount] = React.useState('');
    const [iconName, setIconName] = React.useState('');
    const toggleExpanded = () => setIsExpanded(!isExpanded);

    React.useEffect(() => {
        let walletConnector: any;
        if (typeof window !== 'undefined') {
            const storage = window.localStorage.getItem('WALLET_CONNECTOR');
            if (storage) {
                walletConnector = JSON.parse(storage);
                if (walletConnector && walletConnector.accounts) {
                    setActiveAccount(walletConnector.accounts[0]);
                }
            }
        }
        if (walletConnector && walletConnector.name === 'injected') {
            setIconName(constants.PROVIDER_TYPE_TO_ICON.METAMASK);
            utils.metamaskAccountChange((accounts: any) => {
                if (accounts && accounts.length > 0) {
                    setActiveAccount(accounts[0]);
                    if (typeof window !== undefined && accounts[0]) {
                        const newWalletConnector = JSON.stringify({
                            ...walletConnector,
                            accounts,
                        });
                        window.localStorage.setItem('WALLET_CONNECTOR', newWalletConnector);
                    }
                } else {
                    window.localStorage.removeItem('WALLET_CONNECTOR');
                    setActiveAccount(null);
                }
            });
        } else if (walletConnector && walletConnector.name === 'walletlink') {
            setIconName(constants.PROVIDER_TYPE_TO_ICON.COINBASE_WALLET);
        } else if (walletConnector && walletConnector.name === 'walletconnect') {
            setIconName(constants.PROVIDER_TYPE_TO_ICON.WALLET_CONNECT);
        }
    }, []);

    const logout = async () => {
        if (typeof window !== undefined) {
            window.localStorage.clear();
            window.location.reload();
        }
    };

    // TODO(kimpers): add svgs for all providers
    if (activeAccount) {
        return (
            <SubMenuWrapper onClick={toggleExpanded}>
                <WalletAddressWrapper>
                    {iconName && <Icon name={iconName} size={30} />}
                    <MediaQuery maxWidth={1199}>
                        {(isMobile: boolean) => (
                            <EthAddress>
                                {utils.getAddressBeginAndEnd(activeAccount, isMobile ? 9 : 5, isMobile ? 7 : 4)}
                            </EthAddress>
                        )}
                    </MediaQuery>
                    <MediaQuery minWidth={1200}>
                        <Arrow isExpanded={isExpanded} />
                    </MediaQuery>
                </WalletAddressWrapper>
                <MediaQuery maxWidth={1199}>
                    <MobileMenuWrapper>
                        <MenuItem onClick={props.openConnectWalletDialogCB}>Switch wallet</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </MobileMenuWrapper>
                </MediaQuery>
                <MediaQuery minWidth={1200}>
                    {isExpanded && (
                        <ExpandedMenu>
                            <MenuItem onClick={props.openConnectWalletDialogCB}>Switch wallet</MenuItem>
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </ExpandedMenu>
                    )}
                </MediaQuery>
            </SubMenuWrapper>
        );
    }
    return <ConnectButton onClick={props.openConnectWalletDialogCB}>Connect your wallet</ConnectButton>;
};
