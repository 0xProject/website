import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import React from 'react';
import { useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Text } from 'ts/components/ui/text';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { AccountReady, WebsitePaths } from 'ts/types';
import { constants } from 'ts/utils/constants';
import { formatZrx } from 'ts/utils/format_number';

export const RegisterBanner: React.FC<{}> = () => {
    const [userZRXBalance, setZRXBalance] = React.useState<number>();

    const providerState = useSelector((state: State) => state.providerState);
    React.useEffect(() => {
        if (providerState) {
            const { zrxBalanceBaseUnitAmount } = providerState.account as AccountReady;
            let zrxBalance: BigNumber | undefined;
            if (zrxBalanceBaseUnitAmount) {
                zrxBalance = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
            }

            if (zrxBalance) {
                const roundedZrxBalance = formatZrx(zrxBalance).roundedValue;
                setZRXBalance(roundedZrxBalance);
            }
        }
    }, [providerState]);

    if (userZRXBalance && userZRXBalance > 0) {
        return (
            <Container>
                <BannerImage src="/images/governance/register_banner.svg" />
                <MediaQuery minWidth={768}>
                    <TextContent>
                        <Text
                            noWrap={true}
                            fontColor={colors.textDarkPrimary}
                            Tag="h1"
                            fontSize="28px"
                            fontFamily="Formular"
                        >
                            Register to vote with your ZRX!
                        </Text>
                        <Text
                            noWrap={true}
                            fontColor={colors.textDarkSecondary}
                            fontSize="22px"
                            fontFamily="Formular"
                            fontWeight={300}
                        >
                            Register to vote on upcoming treasury proposals
                        </Text>
                    </TextContent>
                </MediaQuery>
                <MediaQuery maxWidth={768}>
                    <TextContent>
                        <Text noWrap={true} fontColor={colors.textDarkPrimary} Tag="h1" fontSize="22px">
                            Register to vote with your ZRX!
                        </Text>
                        <Text noWrap={true} fontColor={colors.textDarkSecondary} fontSize="14px">
                            Register to vote on upcoming treasury proposals
                        </Text>
                    </TextContent>
                </MediaQuery>
                <Button to={WebsitePaths.Register} color={colors.white}>
                    Register your ZRX
                </Button>
            </Container>
        );
    }
    return null;
};

const Container = styled.div`
    background-color: ${({ theme }) => theme.lightBgColor};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-bottom: 20px;
    max-width: 1500px;

    @media (min-width: 768px) {
        height: 120px;
        flex-direction: row;
        padding-right: 50px;
        padding-bottom: 0px;
        width: auto;
        margin: auto;
    }
`;

const BannerImage = styled.img`
    height: 100%;
`;

const TextContent = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 1;
    justify-content: center;
    white-space: normal;
    text-align: center;
    margin: 20px 0;

    @media (min-width: 768px) {
        margin: 0;
        padding: 0 50px;
        white-space: nowrap;
        text-align: left;
    }
`;
