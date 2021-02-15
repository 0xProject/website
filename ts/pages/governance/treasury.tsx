import { BigNumber } from '@0x/utils';
import { Contract, providers } from 'ethers';
import * as _ from 'lodash';
import { request, gql } from 'graphql-request';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import {
    useQuery,
} from 'react-query';
import { Redirect, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Banner } from 'ts/components/banner';
import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { Column, Section } from 'ts/components/newLayout';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading, Paragraph } from 'ts/components/text';
import { Countdown } from 'ts/pages/governance/countdown';
import { TreasuryProposal } from 'ts/pages/governance/data';
import { ModalVote } from 'ts/pages/governance/modal_vote';
import { VoteInfo } from 'ts/pages/governance/vote_form';
import { VoteStats } from 'ts/pages/governance/vote_stats';
import { colors } from 'ts/style/colors';
import { WebsitePaths } from 'ts/types';
import { ALCHEMY_API_KEY, configs, GOVERNOR_CONTRACT_ADDRESS, GOVERNANCE_THEGRAPH_ENDPOINT } from 'ts/utils/configs';
import { documentConstants } from 'ts/utils/document_meta_constants';

const provider = providers.getDefaultProvider(null, {
    alchemy: ALCHEMY_API_KEY,
});

const FETCH_PROPOSAL = gql`
  query proposal($id: ID!) {
      proposal(id: $id) {
        id
        proposer
        description
        forVotes: votesFor
        againstVotes: votesAgainst
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

export const Treasury: React.FC<{}> = () => {
    const [proposal, setProposal] = React.useState<TreasuryProposal>();
    const [isProposalsLoaded, setProposalsLoaded] = React.useState<boolean>(false);
    const [isVoteReceived] = React.useState<boolean>(false);
    const [isVoteModalOpen] = React.useState<boolean>(false);
    const [quorumThreshold, setQuorumThreshold] = React.useState<BigNumber>();
    const { id: proposalId } = useParams();

    const { data } = useQuery('proposal', async () => {
        const { proposal } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSAL, {
            id: proposalId,
        })
        return proposal;
    });

    const abi = [
        'function quorumThreshold() public view returns (uint)',
    ];

    const contract = new Contract(GOVERNOR_CONTRACT_ADDRESS.ZRX, abi, provider);

    React.useEffect(() => {
        (async () => {
            const qThreshold = await contract.quorumThreshold();
            setQuorumThreshold(qThreshold);
        })();

        if(data) {
            console.log(data);
            const { id, votesAgainst, votesFor, description, executionTimestamp, voteEpoch } = data;
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

            setProposal({
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
            });
            setProposalsLoaded(true);
        }
    }, [data]);

    if (!proposal && isProposalsLoaded) {
        return <Redirect to={`${WebsitePaths.Vote}`} />;
    }

    if (!proposal) {
        return (
            <LoaderWrapper>
                <CircularProgress size={40} thickness={2} color={colors.brandLight} />
            </LoaderWrapper>
        );
    }

    const { forVotes, againstVotes, timestamp, happening: isHappening, description, id } = proposal;
    const tally = {
        no: new BigNumber(againstVotes.toString()),
        yes: new BigNumber(forVotes.toString()),
    };

    const pstOffset = '-0800';
    const deadlineToVote = moment(timestamp)?.utcOffset(pstOffset);
    const isVoteActive = isHappening;

    return (
        <StakingPageLayout isHome={false} title="0x Treasury">
            <DocumentTitle {...documentConstants.VOTE} />
             <Section maxWidth="1170px" isFlex={true}>
                 <Column width="55%" maxWidth="560px">
                     <Countdown deadline={deadlineToVote} />
                     <Heading size="medium">{description.slice(0, 20)}...</Heading>
                     <Paragraph>
                         <StyledMarkdown>
                             <ReactMarkdown children={description} />
                         </StyledMarkdown>
                     </Paragraph>
                     {/* <Button
                             href={proposalData.url}
                             target={proposalData.url !== undefined ? '_blank' : undefined}
                             isWithArrow={true}
                             isAccentColor={true}
                         >
                             Learn More
                         </Button> */}
                 </Column>
                 <Column width="30%" maxWidth="300px">
                     {/* <VoteStats tally={tally} /> */}
                     {isVoteActive && (
                         <VoteButton onClick={() => onOpenVoteModal()} isWithArrow={false}>
                             {isVoteReceived ? 'Vote Received' : 'Vote'}
                         </VoteButton>
                     )}
                 </Column>
             </Section>

        {/* //     {isVoteActive && (
        //         <Banner
        //             heading={`Vote with ZRX Proposal ${id}`}
        //             subline="Use 0x Instant to quickly purchase ZRX for voting"
        //             mainCta={{ text: 'Get ZRX', onClick: () => onLaunchInstantClick() }}
        //             secondaryCta={{ text: 'Vote', onClick: () => onOpenVoteModal() }}
        //         />
        //     )}
        //     <ModalVote
        //         zeipId={id}
        //         isOpen={isVoteModalOpen}
        //         onDismiss={onDismissVoteModal}
        //         onVoted={voteInfo => onVoteReceived(voteInfo)}
        //     /> */}
        </StakingPageLayout>
    );
};

const onLaunchInstantClick = (): void => {
    (window as any).zeroExInstant.render(
        {
            orderSource: configs.VOTE_INSTANT_ORDER_SOURCE,
            availableAssetDatas: configs.VOTE_INSTANT_ASSET_DATAS,
            defaultSelectedAssetData: configs.VOTE_INSTANT_ASSET_DATAS[0],
        },
        'body',
    );
};

const onOpenVoteModal = (): void => {
    // this.setState({ ...this.state, isVoteModalOpen: true });
};

const onDismissVoteModal = (): void => {
    // this.setState({ ...this.state, isVoteModalOpen: false });
};

const onVoteReceived = (voteInfo: VoteInfo): void => {
    // const { userBalance, voteValue } = voteInfo;
    // const tally = { ...this.state.tally };
    // if (voteValue === VoteValue.Yes) {
    //     tally.yes = tally.yes.plus(userBalance);
    // } else {
    //     tally.no = tally.no.plus(userBalance);
    // }
    // this.setState({ ...this.state, isVoteReceived: true, tally });
};

const LoaderWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

// const SectionWrap = styled.div`
//     & + & {
//         padding-top: 50px;
//     }
// `;

const StyledMarkdown = styled.div`
    & a {
        color: ${() => colors.brandLight};
        font-weight: bold;
    }
`;

const VoteButton = styled(Button)`
    display: block;
    margin-bottom: 40px;
    width: 100%;
    max-width: 205px;
    color: white;
`;

// const MoreLink = styled(Button)`
//     & + & {
//         margin-left: 30px;
//     }
// `;
