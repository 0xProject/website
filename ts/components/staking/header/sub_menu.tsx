import * as React from 'react';
import styled from 'styled-components';
import { Providers, ProviderType } from 'ts/types';

import { Icon } from 'ts/components/icon';
import { utils } from 'ts/utils/utils';

const SubMenuWrapper = styled.div`
    display: flex;
    cursor: pointer;
    align-items: center;
    width: 238px;
    height: 60px;
    border: 1px solid rgba(0, 0, 0, 0.4);
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

type ProviderName = Providers.Metamask | Providers.CoinbaseWallet | Providers.Cipher | ProviderType.Ledger;

const ConnectedWallet = ({ userEthAddress, providerName }: { userEthAddress: string; providerName: ProviderName }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const toggleExpanded = () => setIsExpanded(!isExpanded);

    // TODO(kimpers): add svgs for all providers
    return (
        <SubMenuWrapper style={{ justifyContent: 'space-evenly' }} onClick={toggleExpanded}>
            <Icon name={`${providerName.toLowerCase()}_icon`} size={30} />
            <EthAddress>{utils.getAddressBeginAndEnd(userEthAddress)}</EthAddress>
            <Arrow isExpanded={isExpanded} />
        </SubMenuWrapper>
    );
};

interface ISubMenuProps {
    openConnectWalletDialogCB: () => void;

    userEthAddress?: string;
    providerName?: ProviderName;
}

export const SubMenu = ({ userEthAddress, providerName, openConnectWalletDialogCB }: ISubMenuProps) => {
    const isConnected = Boolean(userEthAddress && providerName);

    if (isConnected) {
        return <ConnectedWallet userEthAddress={userEthAddress} providerName={providerName} />;
    }

    return <ConnectButton onClick={openConnectWalletDialogCB} />;
};
