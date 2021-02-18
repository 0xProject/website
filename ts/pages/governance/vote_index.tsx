import { BigNumber } from '@0x/utils';
import { Contract, providers } from 'ethers';
import { gql, request } from 'graphql-request';
import * as _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment';
import * as React from 'react';
import {
    useQuery,
} from 'react-query';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { RegisterBanner } from 'ts/components/governance/register_banner';
import { Column, Section } from 'ts/components/newLayout';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading, Paragraph } from 'ts/components/text';
import { Text } from 'ts/components/ui/text';
import { Proposal, proposals as prodProposals, stagingProposals, TreasuryProposal } from 'ts/pages/governance/data';
import { VoteIndexCard } from 'ts/pages/governance/vote_index_card';
import { colors } from 'ts/style/colors';
import { OnChainProposal, TallyInterface, VotingCardType } from 'ts/types';
import { ALCHEMY_API_KEY, configs, GOVERNANCE_THEGRAPH_ENDPOINT, GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { environments } from 'ts/utils/environments';

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
`;

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
    while (i < onChainProposals.length && j < zeipProposals.length) {
        const treasury = onChainProposals[i];
        const zeip = zeipProposals[j];
        const treasuryStartDate = moment(treasury.startDate);
        const zeipStartDate = moment(zeip.voteStartDate);
        if (treasuryStartDate.isAfter(zeipStartDate)) {
            onChainProposals[i].order = order++;
            i++;
        } else {
            ZEIP_PROPOSALS[j].order = order++;
            j++;
        }
    }

    while (i < onChainProposals.length) {
        onChainProposals[i].order = order++;
        i++;
    }

    while (j < zeipProposals.length) {
        ZEIP_PROPOSALS[j].order = order++;
        j++;
    }
};

const fetchTallysAsync: () => Promise<ZeipTallyMap> = async () => {
    const tallyResponses = await Promise.all(ZEIP_IDS.map(async zeipId => fetchVoteStatusAsync(zeipId)));
    const tallys: { [key: number]: TallyInterface } = {};
    ZEIP_IDS.forEach((zeipId, i) => (tallys[zeipId] = tallyResponses[i]));
    return tallys;
};

interface Proposals {
    [index: string]: any;
}

export const VoteIndex: React.FC<VoteIndexProps> = () => {
    const [filter, setFilter ] = React.useState<string>('all');
    const [tallys, setTallys] = React.useState<ZeipTallyMap>(undefined);
    const [proposals, setProposals] = React.useState<ProposalWithOrder[]>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [quorumThreshold, setQuorumThreshold] = React.useState<BigNumber>();
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

    const { data, isLoading: isQueryLoading } = useQuery('proposals', async () => {
        const { proposals: treasuryProposals } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSALS);
        return treasuryProposals;
    });

    const abi = [
        'function quorumThreshold() public view returns (uint)',
    ];

    const contract = new Contract(GOVERNOR_CONTRACT_ADDRESS.ZRX, abi, provider);

    React.useEffect(() => {
        // tslint:disable-next-line: no-floating-promises
        (async () => {
            const qThreshold = await contract.quorumThreshold();
            setQuorumThreshold(qThreshold);
            const tallyMap: ZeipTallyMap = await fetchTallysAsync();
            setTallys(tallyMap);
        })();

        if (data) {
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
                    canceled: !(isHappening || isUpcoming) && againstVotes >= forVotes || forVotes < quorumThreshold,
                    executed: !!executionTimestamp,
                    upcoming: isUpcoming,
                    happening: isHappening,
                    timestamp,
                    startDate,
                    endDate,
                };
            });
            setLoading(isQueryLoading);
            sortProposals(onChainProposals, ZEIP_PROPOSALS);
            setProposals(onChainProposals);
        }
    }, [data]);

    const applyFilter = (value: string) => {
        setFilter(value);
    };

    const getFilterName = (name: string): string => {
        switch (name) {
            case 'all':
                return 'Showing All';
            case 'zeip':
                return 'ZEIP';
            case 'treasury':
                return 'Treasury';
            default:
                return '';
        }
    };

    const showZEIP = ['all', 'zeip'];
    const showTreasury = ['all', 'treasury'];

    return (
        <StakingPageLayout isHome={false} title="0x Governance">
            <RegisterBanner />
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
                    <Wrapper onClick={() => setIsExpanded(_isExpanded => !_isExpanded)}>
                        <ToggleRow>
                            <StyledText fontColor={colors.textDarkSecondary}>{getFilterName(filter)}</StyledText>
                            <Arrow isExpanded={isExpanded} />
                        </ToggleRow>
                        {isExpanded && (
                            <ExpandedMenu>
                                <MenuItem onClick={() => applyFilter('all')}>
                                    <StyledText>Showing All</StyledText>
                                </MenuItem>
                                <MenuItem onClick={() => applyFilter('zeip')}>
                                    <StyledText>ZEIP</StyledText>
                                </MenuItem>
                                <MenuItem onClick={() => applyFilter('treasury')}>
                                    <StyledText>Treasury</StyledText>
                                </MenuItem>
                            </ExpandedMenu>
                        )}
                    </Wrapper>
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

const Wrapper = styled.div`
    border: none;
    background-color: transparent;
    outline: none;
    width: 150px;
    align-self: flex-end;
    margin-right: 40px;
`;

const Arrow = ({ isExpanded }: { isExpanded?: boolean }) => (
    <svg
        style={{ transform: isExpanded ? 'rotate(180deg)' : null }}
        width="13"
        height="6"
        viewBox="0 0 13 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M1 1L6.5 5L12 1" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ExpandedMenu = styled.div`
    background: ${colors.backgroundLightGrey};
    border: 1px solid rgba(92, 92, 92, 0.15);
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 180px;
    padding: 30px;
    right: 40px;

    @media (max-width: 768px) {
        width: 100%;
        left: 0;
    }
`;

const ToggleRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select: none;
    cursor: pointer;

    * + * {
        margin-left: 8px;
    }
`;

const MenuItem = styled.div`
    cursor: pointer;

    & + & {
        margin-top: 30px;
    }
`;

const StyledText = styled(Text)`
    font-family: 'Formular', monospace;
    font-size: 20px;
    font-feature-settings: 'tnum' on, 'lnum' on;

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;
