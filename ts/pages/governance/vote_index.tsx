import { BigNumber } from '@0x/utils';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { Contract, providers } from 'ethers';
import { request, gql } from 'graphql-request';
import * as _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment';
import * as React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    useQuery,
} from 'react-query';
import MediaQuery  from 'react-responsive';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { Column, Section } from 'ts/components/newLayout';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading, Paragraph } from 'ts/components/text';
import { Text } from 'ts/components/ui/text';
import { Proposal, proposals as prodProposals, stagingProposals, TreasuryProposal } from 'ts/pages/governance/data';
import { VoteIndexCard } from 'ts/pages/governance/vote_index_card';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { AccountReady, TallyInterface, VotingCardType, WebsitePaths } from 'ts/types';
import { ALCHEMY_API_KEY, configs, GOVERNOR_CONTRACT_ADDRESS, GOVERNANCE_THEGRAPH_ENDPOINT } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { environments } from 'ts/utils/environments';
import { formatZrx } from 'ts/utils/format_number';
import { OnChainProposal } from 'ts/types';

import { Treasury } from './treasury';

const FETCH_PROPOSALS = gql`
  query proposals {
      proposals(orderDirection:desc) {
        id
        proposer
        description
        votesFor
        votesAgainst
        createdTimestamp
        voteEpoch {
          id
          startTimestamp
          endTimestamp
        }
        executionEpoch {
          startTimestamp
          endTimestamp
        }
        executionTimestamp
      }
    }
`

type ProposalWithOrder = Proposal & {
    order?: number;
};

const PROPOSALS = environments.isProduction() ? prodProposals : stagingProposals;
const ZEIP_IDS = Object.keys(PROPOSALS).map(idString => parseInt(idString, 10));
const ZEIP_PROPOSALS: ProposalWithOrder[] = ZEIP_IDS.map(id => PROPOSALS[id]).sort(
    (a, b) => b.voteStartDate.unix() - a.voteStartDate.unix(),
);
const provider = providers.getDefaultProvider(null, {
    alchemy: ALCHEMY_API_KEY,
});
const startingBlockNumber = 9951900;

export interface VoteIndexProps {}

interface ZeipTallyMap {
    [id: number]: TallyInterface;
}

const fetchVoteStatusAsync: (zeipId: number) => Promise<TallyInterface> = async zeipId => {
    try {
        const voteDomain = environments.isProduction()
            ? `https://${configs.DOMAIN_VOTE}`
            : `https://${configs.DOMAIN_VOTE_STAGING}`;
        const voteEndpoint = `${voteDomain}/v1/tally/${zeipId}`;
        const response = await fetch(voteEndpoint, {
            method: 'get',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json; charset=utf-8',
            },
        });

        if (!response.ok) {
            throw new Error('Request failed');
        }

        const responseData = await response.json();
        let { no, yes } = responseData;
        yes = new BigNumber(yes);
        no = new BigNumber(no);
        const tally = {
            ...responseData,
            yes: new BigNumber(yes),
            no: new BigNumber(no),
        };
        return tally;
    } catch (e) {
        // Empty block
        return {
            yes: new BigNumber(0),
            no: new BigNumber(0),
        };
    }
};

const sortProposals = (onChainProposals: Proposals[], zeipProposals: Proposal[]) => {
    let i = 0;
    let j = 0;
    let order = 0;
    while(i < onChainProposals.length && j < zeipProposals.length) {
        const treasury = onChainProposals[i];
        const zeip = zeipProposals[j];
        const treasuryStartDate = moment(treasury.startDate);
        const zeipStartDate = moment(zeip.voteStartDate);
        if(treasuryStartDate.isAfter(zeipStartDate)) {
            onChainProposals[i].order = order++;
            i++;
        } else {
            ZEIP_PROPOSALS[j].order = order++;
            j++;
        }
    }

    while(i < onChainProposals.length) {
        onChainProposals[i].order = order++;
        i++;
    }

    while(j < zeipProposals.length) {
        ZEIP_PROPOSALS[j].order = order++;
        j++;
    }
}

const fetchTallysAsync: () => Promise<ZeipTallyMap> = async () => {
    const tallyResponses = await Promise.all(ZEIP_IDS.map(async zeipId => fetchVoteStatusAsync(zeipId)));
    const tallys: { [key: number]: TallyInterface } = {};
    ZEIP_IDS.forEach((zeipId, i) => (tallys[zeipId] = tallyResponses[i]));
    return tallys;
};

interface Proposals {
    [index: string]: any;
}

interface TreasureContextType {
    proposals: Proposals;
}

export const TreasuryContext = React.createContext<TreasureContextType>({
    proposals: {},
});

export const VoteIndex: React.FC<VoteIndexProps> = () => {
    const [filter, setFilter ] = React.useState<string>('all');
    const [tallys, setTallys] = React.useState<ZeipTallyMap>(undefined);
    const [proposals, setProposals] = React.useState<ProposalWithOrder[]>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [userZRXBalance, setZRXBalance] = React.useState<number>();
    const [quorumThreshold, setQuorumThreshold] = React.useState<BigNumber>();

    const { data, isLoading: isQueryLoading } = useQuery('proposals', async () => {
        const { proposals } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSALS)
        return proposals;
    });

    const providerState = useSelector((state: State) => state.providerState);
    React.useEffect(() => {
        if(providerState) {
            const { zrxBalanceBaseUnitAmount } = providerState.account as AccountReady;
            let zrxBalance: BigNumber | undefined;
            if (zrxBalanceBaseUnitAmount) {
                zrxBalance = Web3Wrapper.toUnitAmount(zrxBalanceBaseUnitAmount, constants.DECIMAL_PLACES_ZRX);
            }

            if(zrxBalance) {
                const roundedZrxBalance = formatZrx(zrxBalance).roundedValue;
                setZRXBalance(roundedZrxBalance);
            }
        }
    }, [providerState])

    const abi = [
        'function quorumThreshold() public view returns (uint)',
    ];

    const contract = new Contract(GOVERNOR_CONTRACT_ADDRESS.ZRX, abi, provider);

    const { path } = useRouteMatch();

    React.useEffect(() => {
        (async () => {
            const qThreshold = await contract.quorumThreshold();
            setQuorumThreshold(qThreshold);
            const tallyMap: ZeipTallyMap = await fetchTallysAsync();
            setTallys(tallyMap);
        })();

        if(data) {
            const onChainProposals = data.map((proposal: OnChainProposal) => {
                const { id, votesAgainst, votesFor, description, executionTimestamp, voteEpoch } = proposal;
                const againstVotes = new BigNumber(votesAgainst);
                const forVotes = new BigNumber(votesFor);
                const bigNumStartTimestamp = new BigNumber(voteEpoch.startTimestamp);
                const bigNumEndTimestamp = new BigNumber(voteEpoch.endTimestamp);
                const startDate = moment.unix(bigNumStartTimestamp.toNumber());
                const endDate = moment.unix(bigNumEndTimestamp.toNumber());
                const now = moment();
                const isUpcoming = now.isBefore(startDate);
                const isHappening = now.isAfter(startDate) && now.isBefore(endDate);
                const timestamp = isHappening ? endDate : isUpcoming ? startDate : executionTimestamp ? executionTimestamp : endDate;
                
                return {
                    id,
                    againstVotes,
                    forVotes,
                    description,
                    canceled: !(isHappening || isUpcoming) && againstVotes > forVotes || forVotes < quorumThreshold,
                    executed: !!executionTimestamp,
                    upcoming: isUpcoming,
                    happening: isHappening,
                    timestamp,
                    startDate,
                    endDate,
                }
            });
            setLoading(isQueryLoading);
            sortProposals(onChainProposals, ZEIP_PROPOSALS);
            setProposals(onChainProposals);
        }
    }, [data]);

    const applyFilter: React.ChangeEventHandler = (event: React.ChangeEvent) => {
        const { value } = event.target as HTMLSelectElement;
        setFilter(value);
    }

    const showZEIP = ['all', 'zeip'];
    const showTreasury = ['all', 'treasury'];

    return (
        <Switch>
            <Route exact={true} path={`${WebsitePaths.Vote}/treasury/:proposalId`}>
                <TreasuryContext.Provider value={{ proposals }}>
                    <Treasury />
                </TreasuryContext.Provider>
            </Route>
            <Route path={path}>
                <StakingPageLayout isHome={false} title="0x Governance">
                    {
                        userZRXBalance && userZRXBalance > 0 &&
                        <RegisterBanner>
                            <BannerImage src="/images/governance/register_banner.svg" />
                                <MediaQuery minWidth={768}>
                                    <TextContent>
                                            <Text noWrap={true} fontColor={colors.textDarkPrimary} Tag='h1' fontSize='28px' fontFamily='Formular'>
                                                Register to vote with your ZRX!
                                            </Text>
                                            <Text noWrap={true} fontColor={colors.textDarkSecondary} fontSize='22px' fontFamily='Formular' fontWeight={300}>
                                                Register to vote on upcoming treasury proposals
                                            </Text>
                                    </TextContent>
                                </MediaQuery>
                                <MediaQuery maxWidth={768}>
                                    <TextContent>
                                        <Text noWrap={true} fontColor={colors.textDarkPrimary} Tag='h1' fontSize='22px'>
                                            Register to vote with your ZRX!
                                        </Text>
                                        <Text noWrap={true} fontColor={colors.textDarkSecondary} fontSize='14px'>
                                            Register to vote on upcoming treasury proposals
                                        </Text>
                                    </TextContent>
                                </MediaQuery>
                            <Button to={WebsitePaths.Register} color={colors.white}>
                                Register your ZRX
                            </Button>
                        </RegisterBanner>
                    }
                    <DocumentTitle {...documentConstants.VOTE} />
                    <Section isTextCentered={true} isPadded={true} padding="80px 0 80px">
                        <Column>
                            <Heading size="medium" isCentered={true}>
                                Govern 0x Protocol
                            </Heading>
                            <SubtitleContentWrap>
                                <Paragraph size="medium" isCentered={true} isMuted={true} marginBottom="0">
                                    Vote on 0x Improvement Proposals (ZEIPs) using ZRX tokens.
                                </Paragraph>
                                <ButtonWrapper>
                                    <Button
                                        href={constants.URL_VOTE_FAQ}
                                        isWithArrow={true}
                                        isAccentColor={true}
                                        shouldUseAnchorTag={true}
                                        target="_blank"
                                    >
                                        FAQ
                                    </Button>
                                </ButtonWrapper>
                            </SubtitleContentWrap>
                        </Column>
                    </Section>
                    {isLoading ? (
                        <LoaderWrapper>
                            <CircularProgress size={40} thickness={2} color={colors.brandLight} />
                        </LoaderWrapper>
                    ) : (
                        <VoteIndexCardWrapper>
                            <Filter onChange={applyFilter}>
                                <option value="all" selected>Showing All</option>
                                <option value="zeip">ZEIP</option>
                                <option value="treasury">Treasury</option>
                            </Filter>
                            {showZEIP.includes(filter) && ZEIP_PROPOSALS.map(proposal => {
                                const tally = tallys && tallys[proposal.zeipId];
                                return (
                                    <VoteIndexCard
                                        type={VotingCardType.Zeip}
                                        key={proposal.zeipId}
                                        tally={tally}
                                        {...proposal}
                                    />
                                );
                            })}
                            {showTreasury.includes(filter) && proposals.length > 0 &&
                                proposals.map((proposal: TreasuryProposal) => {
                                    const tally = {
                                        no: new BigNumber(proposal.againstVotes.toString()),
                                        yes: new BigNumber(proposal.forVotes.toString()),
                                        zeip: proposal.id,
                                    };
                                    return (
                                        <VoteIndexCard
                                            type={VotingCardType.Treasury}
                                            key={proposal.id}
                                            tally={tally}
                                            {...proposal}
                                        />
                                    );
                                })}
                        </VoteIndexCardWrapper>
                    )}
                </StakingPageLayout>
            </Route>
        </Switch>
    );
};

const VoteIndexCardWrapper = styled.div`
    margin-bottom: 150px;
    display: flex;
    flex-direction: column;
`;

const SubtitleContentWrap = styled.div`
    max-width: 450px;
    margin: auto;
    & > * {
        display: inline;
    }
`;

const ButtonWrapper = styled.div`
    margin-left: 0.5rem;
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Filter = styled.select`
    border: none;
    background-color: transparent;
    outline: none;
    width: 100px;
    align-self: flex-end;
    margin-right: 40px;
`;

const RegisterBanner = styled.div`
    background-color: ${({ theme }) => theme.lightBgColor};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-bottom: 20px;

    @media (min-width: 768px) {
        height: 120px;
        flex-direction: row;
        padding-right: 50px;
        padding-bottom: 0px;
        width: 90%;
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