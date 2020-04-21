import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading } from 'ts/components/text';
import { Breadcrumb } from 'ts/components/ui/breadcrumb';
import { Table } from 'ts/components/ui/table';
import { StakeStatus } from 'ts/components/ui/table_stake_status';

import { useDispatch, useSelector } from 'react-redux';
import { CallToAction } from 'ts/components/call_to_action';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { AccountReady, EtherscanLinkSuffixes, StakingAPIDelegatorHistoryItem } from 'ts/types';
import { formatEther, formatZrx } from 'ts/utils/format_number';
import { utils } from 'ts/utils/utils';

import { logUtils } from '@0x/utils';
import { useAPIClient } from 'ts/hooks/use_api_client';
import { errorReporter } from 'ts/utils/error_reporter';

export interface ActivityProps {}

const columns = ['Event timestamp', 'Event', 'Transaction'];

function parseEvent(event: StakingAPIDelegatorHistoryItem): {title: string; subtitle: string} {
    if (event.eventType === 'earned_rewards') {
        const title = 'Earned Rewards';
        const subtitle = `You earned ${formatEther(event.eventArgs.reward).formatted} ETH from pool ${event.eventArgs.poolId} for epoch ${event.eventArgs.epochId}.`;
        return {title, subtitle};
    } else if (event.eventType === 'deposited_zrx') {
        const title = 'Deposited ZRX';
        const subtitle = `You deposited ${formatZrx(event.eventArgs.zrxAmount).formatted} ZRX into the staking contract.`;
        return {title, subtitle};
    } else if (event.eventType === 'withdrew_zrx') {
        const title = 'Withdrew ZRX';
        const subtitle = `You withdrew ${formatZrx(event.eventArgs.zrxAmount).formatted} ZRX from the staking contract.`;
        return {title, subtitle};
    } else if (event.eventType === 'staked') {
        const title = 'Staked';
        const subtitle = `You staked ${formatZrx(event.eventArgs.zrxAmount).formatted} ZRX with pool ${event.eventArgs.poolId}.`;
        return {title, subtitle};
    } else if (event.eventType === 'removed_stake') {
        const title = 'Removed Stake';
        const subtitle = `You removed ${formatZrx(event.eventArgs.zrxAmount).formatted} ZRX from pool ${event.eventArgs.poolId}.`;
        return {title, subtitle};
    } else if (event.eventType === 'moved_stake') {
        const title = 'Moved Stake';
        const subtitle = `You moved ${formatZrx(event.eventArgs.zrxAmount).formatted} ZRX from pool ${event.eventArgs.fromPoolId} to pool ${event.eventArgs.toPoolId}.`;
        return {title, subtitle};
    } else {
        return {title: 'Unknown event', subtitle: ''};
    }
}

export const AccountActivity: React.FC<ActivityProps> = () => {
    const providerState = useSelector((state: State) => state.providerState);
    const networkId = useSelector((state: State) => state.networkId);
    const dispatch = useDispatch();

    const onOpenConnectWalletDialog = React.useCallback(() => {
        const dispatcher = new Dispatcher(dispatch);
        dispatcher.updateIsConnectWalletDialogOpen(true);
    }, [dispatch]);

    const account = providerState.account as AccountReady;

    const [isFetchingDelegatorData, setIsFetchingDelegatorData] = React.useState<boolean>(false);
    const [delegatorHistory, setDelegatorHistory] = React.useState<StakingAPIDelegatorHistoryItem[] | undefined>(undefined);

    const accountLoaded = account && account.address;

    const apiClient = useAPIClient(networkId);

    React.useEffect(() => {
        const fetchDelegatorData = async () => {
            const [delegatorHistoryResponse] = await Promise.all([
                apiClient.getDelegatorHistoryAsync(account.address),
            ]);

            setDelegatorHistory(delegatorHistoryResponse);
        };

        if (!account.address || isFetchingDelegatorData) {
            return;
        }

        setIsFetchingDelegatorData(true);
        fetchDelegatorData()
            .then(() => {
                setIsFetchingDelegatorData(false);
            })
            .catch((err: Error) => {
                setDelegatorHistory(undefined);
                setIsFetchingDelegatorData(false);
                logUtils.warn(err);
                errorReporter.report(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account.address, apiClient]);

    if (!accountLoaded) {
        return (
            <StakingPageLayout title="0x Staking | Activity">
                <SectionWrapper>
                    <Heading />
                    <CallToAction
                        icon="wallet"
                        title="Connect your wallet"
                        description="Connect your wallet to see your account."
                        actions={[
                            {
                                label: 'Connect your wallet',
                                onClick: onOpenConnectWalletDialog,
                            },
                        ]}
                    />
                </SectionWrapper>
            </StakingPageLayout>
        );
    }

    const crumbs = [
        {
            label: utils.getAddressBeginAndEnd(account.address, 7, 3),
            url: '/zrx/account',
        },
        {
            label: 'Activity',
        },
    ];

    return (
        <StakingPageLayout title="0x Staking | Activity">
            <Breadcrumb crumbs={crumbs} />

            <ContentWrap>
                <Heading
                    asElement="h1"
                    fontWeight="500"
                    marginBottom="60px"
                >
                    Activity
                </Heading>

                <Table columns={columns}>
                    {_.map(delegatorHistory, row => {
                        const description = parseEvent(row);

                        return (
                            <tr>
                                <DateCell>
                                    <strong>
                                        {Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: '2-digit',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            second: '2-digit',
                                          }).format(new Date(row.eventTimestamp))}
                                    </strong>
                                </DateCell>
                                <td>
                                    <StyledStakeStatus
                                        title={description.title}
                                        subtitle={description.subtitle}
                                    />
                                </td>
                                <td>
                                    <a href={utils.getEtherScanLinkIfExists(row.transactionHash, networkId, EtherscanLinkSuffixes.Tx)} target="_blank" rel="noopener">
                                        {row.transactionHash === null ? '-' : utils.getAddressBeginAndEnd(row.transactionHash)}
                                    </a>
                                </td>
                            </tr>
                        );
                    })}
                </Table>
            </ContentWrap>
        </StakingPageLayout>
    );
};

const ContentWrap = styled.div`
    width: calc(100% - 40px);
    max-width: 1152px;
    margin: 90px auto 0 auto;

    a {
        color: ${colors.brandLight};
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 34px;
        }
    }
`;

const DateCell = styled.td`
    color: ${colors.textDarkSecondary};

    strong {
        display: block;
        margin-bottom: 10px;
        color: ${colors.textDarkPrimary}
    }
`;

const StyledStakeStatus = styled(StakeStatus)`
    @media (max-width: 768px) {
        span {
            display: none;
        }
    }
`;

const SectionWrapper = styled.div`
    width: calc(100% - 40px);
    max-width: 1152px;
    margin: 0 auto;

    & + & {
        margin-top: 90px;
    }
`;
