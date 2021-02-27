import { ZrxTreasuryContract } from '@0x/contracts-treasury';
import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import { gql, request } from 'graphql-request';
import marked, { Token, Tokens } from 'marked';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelector } from 'react-redux';
import {
    useQuery,
} from 'react-query';
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
import { utils } from 'ts/utils/utils';
import { ALCHEMY_API_KEY, configs, GOVERNOR_CONTRACT_ADDRESS, GOVERNANCE_THEGRAPH_ENDPOINT } from 'ts/utils/configs';
import { documentConstants } from 'ts/utils/document_meta_constants';

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
          startTimestamp
          endTimestamp
        }
        executionTimestamp
      }
    }
`;

type ProposalState = 'created' |'active' |'succeeded' |'failed' |'queued' |'executed';

export const Treasury: React.FC<{}> = () => {
    const [proposal, setProposal] = React.useState<TreasuryProposal>();
    const [isProposalsLoaded, setProposalsLoaded] = React.useState<boolean>(false);
    const [isVoteReceived, setIsVoteReceived] = React.useState<boolean>(false);
    const [isVoteModalOpen, setIsVoteModalOpen] = React.useState<boolean>(false);
    const [quorumThreshold, setQuorumThreshold] = React.useState<BigNumber>();
    const { id: proposalId } = useParams();
    const providerState = useSelector((state: State) => state.providerState);

    const { data } = useQuery('proposal', async () => {
        const { proposal } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSAL, {
            id: proposalId,
        })
        return proposal;
    });



    const contract = new ZrxTreasuryContract(GOVERNOR_CONTRACT_ADDRESS.ZRX, providerState.provider);

    React.useEffect(() => {
        (async () => {
            const qThreshold = await contract.quorumThreshold().callAsync();
            setQuorumThreshold(qThreshold);
        })();

        if (data) {
            const { id, votesAgainst, votesFor, description, executionTimestamp, voteEpoch, createdTimestamp, executionEpoch } = data;
            const againstVotes = new BigNumber(votesAgainst);
            const forVotes = new BigNumber(votesFor);
            const tally = {
                no: new BigNumber(againstVotes.toString()),
                yes: new BigNumber(forVotes.toString()),
            };

            const bigNumStartTimestamp = new BigNumber(voteEpoch.startTimestamp);
            const bigNumEndTimestamp = new BigNumber(voteEpoch.endTimestamp);
            const startDate = moment.unix(bigNumStartTimestamp.toNumber());
            const endDate = moment.unix(bigNumEndTimestamp.toNumber());

            const bigNumExecutionStartTimestamp = new BigNumber(executionEpoch.startTimestamp);
            const bigNumExecutionEndTimestamp = new BigNumber(executionEpoch.endTimestamp);
            const executionStartDate = moment.unix(bigNumExecutionStartTimestamp.toNumber());
            const executionEndDate = moment.unix(bigNumExecutionEndTimestamp.toNumber());

            const now = moment();
            const isUpcoming = now.isBefore(startDate);
            const isHappening = now.isAfter(startDate) && now.isBefore(endDate);
            const timestamp = isHappening ? endDate : isUpcoming ? startDate : executionTimestamp ? executionTimestamp : endDate;

            setProposal({
                proposer: data.proposer,
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
                createdTimestamp: moment.unix(createdTimestamp),
                executionStartDate,
                executionEndDate,
                tally,
            });
            setProposalsLoaded(true);
        }
    }, [data]);

    const onVoteReceived = (voteInfo: VoteInfo): void => {
        const { userBalance, voteValue } = voteInfo;
        const tally = { ...proposal.tally };
        if (voteValue === VoteValue.Yes) {
            tally.yes = tally.yes.plus(userBalance);
        } else {
            tally.no = tally.no.plus(userBalance);
        }
        setProposal({
            ...proposal,
            tally
        });
        setIsVoteReceived(true);
    };

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

    const { forVotes, againstVotes, timestamp, happening: isHappening, description, id, canceled: isCanceled, executed: isExecuted, upcoming: isUpcoming, executionStartDate, executionEndDate, tally } = proposal;

    const pstOffset = '-0800';
    const deadlineToVote = moment(timestamp)?.utcOffset(pstOffset);
    const isVoteActive = isHappening;

    const tokens = marked.lexer(description);
    const heading = tokens.find((token: Token) => (token as Tokens.Heading).type === 'heading' && (token as Tokens.Heading).depth === 1);

    const now = moment();

    const proposalHistoryState = {
        created: {
            done: true,
            timestamp: proposal.createdTimestamp,
            show: true,
        }, 
        active: {
            done: now.isAfter(proposal.startDate),
            timestamp: proposal.startDate,
            show: true,
        },
        succeeded: {
            done: !(isCanceled || isHappening || isUpcoming || isExecuted),
            timestamp: proposal.endDate,
            show: !(isCanceled || isHappening || isUpcoming || isExecuted),
        },
        failed: {
            done: isCanceled,
            timestamp: proposal.endDate,
            show: isCanceled,
        },
        queued: {
            done: !(isCanceled || isHappening || isUpcoming),
            timestamp: executionStartDate,
            show: !(isCanceled || isHappening || isUpcoming || isExecuted),
        },
        executed: {
            done: isExecuted,
            timestamp: executionEndDate,
            show: !(isCanceled || isHappening || isUpcoming || isExecuted),
        }
    }

    return (
        <StakingPageLayout isHome={false} title="0x Treasury">
            <RegisterBanner />
            <DocumentTitle {...documentConstants.VOTE} />
             <Section maxWidth="1170px" isFlex={true}>
                 <Column width="55%" maxWidth="560px">
                     <Countdown deadline={deadlineToVote} />
                     <Tag>Treasury</Tag>
                     <Heading size="medium" marginBottom="0px">{(heading as Tokens.Heading).text}</Heading>
                     <StyledText fontColor={colors.textDarkSecondary} fontSize="18px" fontWeight={300} fontFamily='Formular'>Submitted by: {utils.getAddressBeginAndEnd(proposal.proposer)}</StyledText>
                     <Paragraph>
                         <StyledMarkdown>
                             <ReactMarkdown children={description.replace(heading.raw, '')} />
                         </StyledMarkdown>
                     </Paragraph>
                 </Column>
                 <Column width="30%" maxWidth="300px">
                    <Text fontColor={colors.textDarkSecondary} fontSize='18px' fontWeight={300} fontFamily='Formular'>
                        {timestamp && (isExecuted || isCanceled)
                            ? `Ended ${timestamp.format('MMM DD, YYYY - HH:mm a')}`
                            : isHappening
                            ? `Voting ends in ${timestamp.diff(moment(), 'days')} days`
                            : `Upcoming in ${timestamp.diff(moment(), 'days')} days`}
                    </Text>
                     { tally && <VoteStats tally={tally} /> }
                     {isVoteActive && (
                         <VoteButton onClick={() => setIsVoteModalOpen(true)} isWithArrow={false}>
                             {isVoteReceived ? 'Vote Received' : 'Vote'}
                         </VoteButton>
                     )}

                    <Heading>
                        Proposal History
                    </Heading>
                    <ProposalHistory>
                        <Ticks>
                            {
                                Object.keys(proposalHistoryState).map((state: string) => {
                                    const historyState = proposalHistoryState[state as ProposalState];
                                    if (!historyState.show) {
                                        return null;
                                    }
                                    return (
                                        <>
                                            <Tick isActive={historyState.done} isFailed={state === 'failed'}><img src={ state === 'failed' ? "/images/governance/cross.svg" : "/images/governance/tick_mark.svg"} /></Tick>
                                            {
                                                !['executed', 'failed'].includes(state) &&
                                                <Connector className={state === 'queued' ? 'small' : ''} />
                                            }
                                        </>
                                    );
                                })
                            }
                        </Ticks>
                        <HistoryCells>
                            {
                                Object.keys(proposalHistoryState).map((state: string) => {
                                    const historyState = proposalHistoryState[state as ProposalState];
                                    if (!historyState.show) {
                                        return null;
                                    }
                                    return (
                                        <CellContent>
                                            <StateTitle fontColor={colors.textDarkSecondary} fontFamily='Formular' fontSize='18px' fontWeight={400}>{state}</StateTitle>
                                            <Text fontColor={colors.textDarkSecondary} fontFamily='Formular' fontSize='17px' fontWeight={300}>{historyState.done ? historyState.timestamp.format("MMMM Do, YYYY - hh:mm a") : 'TBD'}</Text>
                                        </CellContent>
                                    )
                                })
                            }
                        </HistoryCells>
                    </ProposalHistory>
                 </Column>
             </Section>

              {isVoteActive && (
                 <Banner
                     heading={`Vote with ZRX Proposal ${id}`}
                     subline="Use 0x Instant to quickly purchase ZRX for voting"
                     mainCta={{ text: 'Get ZRX', onClick: () => onLaunchInstantClick() }}
                     secondaryCta={{ text: 'Vote', onClick: () => setIsVoteModalOpen(true) }}
                 />
             )}
             <ModalTreasuryVote
                 zeipId={id}
                 isOpen={isVoteModalOpen}
                 onDismiss={() => setIsVoteModalOpen(false)}
                 onVoted={voteInfo => onVoteReceived(voteInfo)}
             />
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

const Tag = styled.div`
    padding: 5px 2px 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${() => colors.yellow500};
    color: ${() => colors.white};
    width: 60px;
    font-size: 12px;
    margin-bottom: 12px;
`;

const StyledText = styled(Text)`
    margin-bottom: 36px;
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

const Tick = styled.div<{ isActive: boolean; isFailed: boolean}>`
    height: 35px;
    width: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ isActive, isFailed }) => isActive ? isFailed ? colors.error : colors.brandLight : '#c4c4c4'};

    & img {
        height: 16px;
        width: 16px;
    }
`;

const Connector = styled.div`
    height: 30px;
    width: 1px;
    background-color: ${() => colors.border};

    &.small {
        height: 25px;
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
