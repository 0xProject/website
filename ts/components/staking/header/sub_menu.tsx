import * as React from 'react';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';

import { Providers, ProviderType } from 'ts/types';

import { Icon } from 'ts/components/icon';
import { colors } from 'ts/style/colors';
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

const ConnectButton = ({ onClick }: { onClick: () => void }) => (
    <SubMenuWrapper style={{ justifyContent: 'center' }} onClick={onClick}>
        <span>Connect your wallet</span>
    </SubMenuWrapper>
);

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

type ProviderName = Providers.Metamask | Providers.CoinbaseWallet | Providers.Cipher | ProviderType.Ledger;

const ConnectedWallet = ({
    userEthAddress,
    providerName,
    openConnectWalletDialogCB,
    logoutWalletCB,
}: ISubMenuProps) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const toggleExpanded = () => setIsExpanded(!isExpanded);

    // TODO(kimpers): add svgs for all providers
    return (
        <SubMenuWrapper onClick={toggleExpanded}>
            <WalletAddressWrapper>
                <Icon name={`${providerName.toLowerCase()}_icon`} size={30} />
                <EthAddress>{utils.getAddressBeginAndEnd(userEthAddress)}</EthAddress>
                <MediaQuery minWidth={1200}>
                    <Arrow isExpanded={isExpanded} />
                </MediaQuery>
            </WalletAddressWrapper>
            <MediaQuery maxWidth={1199}>
                <MobileMenuWrapper>
                    <MenuItem onClick={openConnectWalletDialogCB}>Switch wallet</MenuItem>
                    <MenuItem onClick={logoutWalletCB}>Logout</MenuItem>
                </MobileMenuWrapper>
            </MediaQuery>
            <MediaQuery minWidth={1200}>
                {isExpanded && (
                    <ExpandedMenu>
                        <MenuItem onClick={openConnectWalletDialogCB}>Switch wallet</MenuItem>
                        <MenuItem onClick={logoutWalletCB}>Logout</MenuItem>
                    </ExpandedMenu>
                )}
            </MediaQuery>
        </SubMenuWrapper>
    );
};

interface ISubMenuProps {
    openConnectWalletDialogCB: () => void;
    logoutWalletCB: () => void;

    userEthAddress?: string;
    providerName?: ProviderName;
}

export const SubMenu = (props: ISubMenuProps) => {
    const isConnected = Boolean(props.userEthAddress && props.providerName);

    if (isConnected) {
        return <ConnectedWallet {...props} />;
    }

    return <ConnectButton onClick={props.openConnectWalletDialogCB} />;
};
