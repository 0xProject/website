import { BigNumber } from '@0x/utils';
import { gql, request } from 'graphql-request';
import * as _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import * as React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { GOVERNANCE_THEGRAPH_ENDPOINT } from 'ts/utils/configs';
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

    useQuery('proposal', async () => {
        const { proposal: proposalFromGraph } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSAL, {
            id: proposalId,
        });

        return proposalFromGraph;
    });

    React.useEffect(() => {
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
    return (
        <StakingPageLayout isHome={false} title="Proposal Voter Leaderboard">
            <VoterLeaderboardHeader>
                <ArrowLink href={`/zrx/vote/proposal/${proposalId}`}>←</ArrowLink>
                <ProposalLink href={`/zrx/vote/proposal/${proposalId}`}>Treasury Proposal {proposalId}</ProposalLink>/
                Voter Leaderboard
            </VoterLeaderboardHeader>
            <VoterLeaderboardContainer>
                {voterBreakdownData && <VoterBreakdown data={voterBreakdownData} shouldShowAll={true} />}
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
