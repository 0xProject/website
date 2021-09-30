import { ZrxTreasuryContract } from '@0x/contracts-treasury';
import { BigNumber } from '@0x/utils';
import { gql, request } from 'graphql-request';
import * as _ from 'lodash';
import marked, { Token, Tokens } from 'marked';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment-timezone';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Banner } from 'ts/components/banner';
import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { RegisterBanner } from 'ts/components/governance/register_banner';
import { Column, Section } from 'ts/components/newLayout';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading, Paragraph } from 'ts/components/text';
import { Text } from 'ts/components/ui/text';
import { Countdown } from 'ts/pages/governance/countdown';
import { TreasuryProposal } from 'ts/pages/governance/data';
import { ModalTreasuryVote } from 'ts/pages/governance/modal_vote';
import { VoteInfo, VoteValue } from 'ts/pages/governance/vote_form';
import { VoteStats } from 'ts/pages/governance/vote_stats';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { WebsitePaths } from 'ts/types';
import { configs, GOVERNANCE_THEGRAPH_ENDPOINT, GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { utils } from 'ts/utils/utils';

import { VoterBreakdown } from 'ts/components/governance/voter_breakdown';
import { fetchUtils } from 'ts/utils/fetch_utils';

const TREASURY_VOTER_BREAKDOWN_URI = 'https://um5ppgumcc.us-east-1.awsapprunner.com';

const FETCH_PROPOSAL = gql`
    query proposal($id: ID!) {
        proposal(id: $id) {
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
                id
                startTimestamp
                endTimestamp
            }
            executionTimestamp
        }
    }
`;

interface VoterBreakdownData {
    voter: string;
    proposalId: string;
    support: boolean;
    votingPower: string;
}

export const VoterLeaderboard: React.FC<{}> = () => {
    const [voterBreakdownData, setVoterBreakdownData] = React.useState<VoterBreakdownData[]>();
    const { id: proposalId } = useParams();
    const providerState = useSelector((state: State) => state.providerState);

    const { data } = useQuery('proposal', async () => {
        const { proposal: proposalFromGraph } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSAL, {
            id: proposalId,
        });

        return proposalFromGraph;
    });

    React.useEffect(() => {
        const contract = new ZrxTreasuryContract(GOVERNOR_CONTRACT_ADDRESS.ZRX, providerState.provider);
        // tslint:disable-next-line: no-floating-promises
        (async () => {
            const result = await fetchUtils.requestAsync(TREASURY_VOTER_BREAKDOWN_URI, `/treasury/${proposalId}`);
            const cleanedData = result
                .sort((a: VoterBreakdownData, b: VoterBreakdownData) => {
                    return parseFloat(b.votingPower) - parseFloat(a.votingPower);
                })
                .map((vote: VoterBreakdownData) => {
                    vote.votingPower = utils.getFormattedAmount(new BigNumber(vote.votingPower), 18);
                    vote.votingPower = vote.votingPower.split('.')[0];
                    return vote;
                });

            setVoterBreakdownData(cleanedData);
        })();
    }, [providerState]);

    console.log(voterBreakdownData);
    return (
        <StakingPageLayout isHome={false} title="Proposal Voter Leaderboard">
            <VoterLeaderboardHeader>
                <ArrowLink href={`/zrx/vote/proposal/${proposalId}`}>←</ArrowLink>
                <ProposalLink href={`/zrx/vote/proposal/${proposalId}`}>Treasury Proposal {proposalId}</ProposalLink>/
                Voter Leaderboard
            </VoterLeaderboardHeader>
            <VoterLeaderboardContainer>
                {voterBreakdownData && <VoterBreakdown data={voterBreakdownData} showAll />}
                {!voterBreakdownData && (
                    <LoaderWrapper>
                        <CircularProgress size={40} thickness={2} color={colors.brandLight} />
                    </LoaderWrapper>
                )}
            </VoterLeaderboardContainer>
        </StakingPageLayout>
    );
};

const ArrowLink = styled.a`
    margin-right: 1rem;
    color: #5c5c5c;
`;

const ProposalLink = styled.a`
    color: #5c5c5c;
    margin-right: 0.25rem;
`;

const VoterLeaderboardContainer = styled.div`
    padding: 0px 2rem;
    margin: 0 auto;
    max-width: 1500px;
`;

const VoterLeaderboardHeader = styled.div`
    background-color: #f6f6f6;
    margin: 0 auto;
    max-width: 1500px;
    padding: 2rem;
    margin-bottom: 1.5rem;
`;

const LoaderWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledMarkdown = styled.div`
    & a {
        color: ${() => colors.brandLight};
        font-weight: normal;
    }
    & h2 {
        font-size: 28px;
        font-weight: 400;
        margin-bottom: 20px;
        color: black;
    }

    & p {
        margin-bottom: 40px;
        color: black;
    }

    & ul {
        margin-bottom: 30px;
        list-style-type: circle;
        padding-left: 2rem;
    }

    & td {
        text-align: right;
    }

    table,
    th,
    td {
        border: 1px solid ${colors.border};
        text-align: right;
        padding: 0.5rem;
    }
    & table {
        margin-bottom: 30px;
    }
`;

const VoteButton = styled(Button)`
    display: block;
    margin-bottom: 0;
    width: 100%;
    max-width: 205px;
    color: white;
`;

const Tag = styled.div`
    padding: 5px 2px 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${() => colors.yellow500};
    color: ${() => colors.white};
    width: 80px;
    font-size: 17px;
    margin-bottom: 12px;
`;

const StyledText = styled(Text)`
    margin-bottom: 36px;
    margin-top: 10px;
`;

const ProposalHistory = styled.div`
    display: flex;
`;

const HistoryCells = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Ticks = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Tick = styled.div<{ isActive: boolean; isFailed: boolean }>`
    height: 29px;
    width: 29px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ isActive, isFailed }) =>
        isActive ? (isFailed ? colors.error : colors.brandLight) : '#c4c4c4'};

    & img {
        height: 16px;
        width: 16px;
    }
`;

const Connector = styled.div`
    height: 36px;
    width: 1px;
    background-color: ${() => colors.border};

    &.small {
        height: 31px;
        margin-bottom: 5px;
    }
`;

const CellContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 16px;
    height: 65px;
    width: 100%;
`;

const StateTitle = styled(Text)`
    text-transform: capitalize;
`;

const StyledHeading = styled(Heading)`
    margin-top: 68px;
    margin-bottom: 24px !important;
`;
