import * as React from 'react';
import styled from 'styled-components';

import { GasTickerIcon } from 'ts/components/staking/gas_ticker_icon';
import { colors } from 'ts/style/colors';
import { backendClient } from 'ts/utils/backend_client';

const Container = styled.a`
    display: inline-flex;
    height: 60px;
    align-items: center;
    border: 1px solid ${colors.border};
    padding: 22px 20px 20px;
    margin-right: 20px;
    cursor: pointer;
    @media (max-width: 428px) {
        width: 40%;
        margin-bottom: 20px;
    }
`;

const ExpandedMenu = styled.div`
    width: 187px;
    height: auto;
    background: ${colors.backgroundLightGrey};
    border: 1px solid rgba(92, 92, 92, 0.15);
    position: absolute;
    top: 98px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 20px;
    cursor: pointer;
    margin-left: -58px;

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

const MenuItemWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 17px;
    color: #000000;

    @media (min-width: 1200px) {
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 20px;

        &:hover {
            opacity: 0.5;
            transform: translate3d(0, 0, 0);
            transition: opacity 0.35s, transform 0.35s, visibility 0s;
        }
    }
`;

const MenuItemText = styled.span`
    font-size: 16px;
    align-self: flex-end;
    font-weight: lighter;
`;

const MenuItemGasValue = styled.span`
    align-self: flex-end;
`;

const GasTickerValue = styled.div`
    margin: 0 10px;
    width: 30px;
    text-align: center;
    margin-top: 4px;
    font-size: 18px;
`;

const Gwei = styled.span`
    font-size: 12px;
`;

interface GasInfo {
    [key: string]: number;
}

const Arrow = ({ isExpanded }: { isExpanded?: boolean }) => (
    <svg
        style={{ transform: isExpanded ? 'rotate(180deg)' : null, marginTop: '4px' }}
        width="17"
        height="9"
        viewBox="0 0 17 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M16 1L8.5 8.5L1 1" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const GweiTag = () => <Gwei>gwei</Gwei>;

type GasSpeed = 'standard' | 'fast' | 'instant';

export const GasTicker: React.FC<{}> = ({}) => {
    const [gasInfo, setGasInfo] = React.useState<GasInfo | undefined>(undefined);
    const [selectedSpeed, setSelectedSpeed] = React.useState<GasSpeed>('standard');
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    const menuSetSpeed = (speed: GasSpeed) => {
        setSelectedSpeed(speed);
        localStorage.setItem('gas-speed', speed);
    };

    const getGasInfo = React.useCallback(async () => {
        const gasInfoRes = await backendClient.getGasInfoSelectionAsync();
        setGasInfo({
            ...gasInfo,
            instant: gasInfoRes.fastest,
            fast: gasInfoRes.fast,
            standard: gasInfoRes.average,
        });
    }, []);

    React.useEffect(() => {
        const localStorageSpeed = localStorage.getItem('gas-speed');

        if (localStorageSpeed) {
            setSelectedSpeed(localStorageSpeed as GasSpeed);
        }

        getGasInfo().then(
            () => {
                return;
            },
            () => {
                return;
            },
        );
        const interval = setInterval(getGasInfo, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Container onClick={toggleExpanded}>
                <GasTickerIcon />
                {gasInfo && (
                    <>
                        <GasTickerValue>{gasInfo[selectedSpeed]}</GasTickerValue>
                        <Arrow isExpanded={isExpanded} />
                    </>
                )}
            </Container>
            {isExpanded && (
                <ExpandedMenu>
                    <MenuItemWrapper
                        onClick={() => {
                            menuSetSpeed('standard');
                        }}
                    >
                        <MenuItemText>Standard</MenuItemText>
                        <MenuItemGasValue>
                            {gasInfo.standard} <GweiTag />
                        </MenuItemGasValue>
                    </MenuItemWrapper>
                    <MenuItemWrapper
                        onClick={() => {
                            menuSetSpeed('fast');
                        }}
                    >
                        <MenuItemText>Fast</MenuItemText>
                        <MenuItemGasValue>
                            {gasInfo.fast} <GweiTag />
                        </MenuItemGasValue>
                    </MenuItemWrapper>
                    <MenuItemWrapper
                        onClick={() => {
                            menuSetSpeed('instant');
                        }}
                    >
                        <MenuItemText>Instant</MenuItemText>
                        <MenuItemGasValue>
                            {gasInfo.instant} <GweiTag />
                        </MenuItemGasValue>
                    </MenuItemWrapper>
                </ExpandedMenu>
            )}
        </>
    );
};
