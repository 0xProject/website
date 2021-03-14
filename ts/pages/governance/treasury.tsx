import { BigNumber } from '@0x/utils';
import { gql, request } from 'graphql-request';
import * as _ from 'lodash';
import marked, { Token, Tokens } from 'marked';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
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
import { colors } from 'ts/style/colors';
import { WebsitePaths } from 'ts/types';
import { configs, GOVERNANCE_THEGRAPH_ENDPOINT } from 'ts/utils/configs';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { utils } from 'ts/utils/utils';

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

type ProposalState = 'created' |'active' |'succeeded' |'failed' |'queued' |'executed';

export const Treasury: React.FC<{}> = () => {
    const [proposal, setProposal] = React.useState<TreasuryProposal>();
    const [isProposalsLoaded, setProposalsLoaded] = React.useState<boolean>(false);
    const [isVoteReceived, setIsVoteReceived] = React.useState<boolean>(false);
    const [isVoteModalOpen, setIsVoteModalOpen] = React.useState<boolean>(false);
    const [quorumThreshold, setQuorumThreshold] = React.useState<BigNumber>();
    const { id: proposalId } = useParams();

    const { data } = useQuery('proposal', async () => {
        const { proposal: proposalFromGraph } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSAL, {
            id: proposalId,
        });

        return proposalFromGraph;
    });

    React.useEffect(() => {
        // tslint:disable-next-line:no-floating-promises
        (async () => {
            // const qThreshold = await contract.quorumThreshold().callAsync();
            // setQuorumThreshold(qThreshold);
            const hardCodeQuorumThreshold = new BigNumber('10000000');
            setQuorumThreshold(hardCodeQuorumThreshold);
        })();

        if (data) {
            // Disabling linter to allow for shadowed variables
            // tslint:disable no-shadowed-variable
            const { id, votesAgainst, votesFor, description, executionTimestamp, voteEpoch, createdTimestamp, executionEpoch } = data;
            const againstVotes = new BigNumber(votesAgainst);
            const forVotes = new BigNumber(votesFor);
            const tally = {
                no: new BigNumber(againstVotes.toString()),
                yes: new BigNumber(forVotes.toString()),
            };

            const bigNumStartTimestamp = new BigNumber(voteEpoch.startTimestamp);
            const startDate = moment.unix(bigNumStartTimestamp.toNumber());
            const endDate = startDate.clone();
            endDate.add(3, 'd');

            const bigNumExecutionStartTimestamp = new BigNumber(executionEpoch.startTimestamp);
            const bigNumExecutionEndTimestamp = new BigNumber(executionEpoch.endTimestamp);
            const executionEpochStartDate = moment.unix(bigNumExecutionStartTimestamp.toNumber());
            const executionEpochEndDate = moment.unix(bigNumExecutionEndTimestamp.toNumber());
            const executionTimestampMoment = moment.unix(executionTimestamp);

            const now = moment();
            const isUpcoming = now.isBefore(startDate);
            const isHappening = now.isAfter(startDate) && now.isBefore(endDate);
            const timestamp = isHappening ? endDate : isUpcoming ? startDate : endDate;
            // tslint:enable no-shadowed-variable

            setProposal({
                proposer: data.proposer,
                id,
                againstVotes,
                forVotes,
                description,
                canceled: !isHappening && !isUpcoming && (againstVotes >= forVotes || forVotes < quorumThreshold),
                executed: !!executionTimestamp,
                upcoming: isUpcoming,
                happening: isHappening,
                timestamp,
                startDate,
                endDate,
                createdTimestamp: moment.unix(createdTimestamp),
                executionEpochStartDate,
                executionEpochEndDate,
                tally,
                executionTimestamp: executionTimestampMoment,
            });
            setProposalsLoaded(true);
        }
    }, [data]);

    const onVoteReceived = (voteInfo: VoteInfo): void => {
        const { userBalance, voteValue } = voteInfo;
        const voteTally = { ...proposal.tally };
        if (voteValue === VoteValue.Yes) {
            voteTally.yes = voteTally.yes.plus(userBalance);
        } else {
            voteTally.no = voteTally.no.plus(userBalance);
        }
        setProposal({
            ...proposal,
            tally: voteTally,
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

    const { timestamp, happening: isHappening, description, id, canceled: isCanceled, executed: isExecuted, upcoming: isUpcoming, tally, executionTimestamp, executionEpochEndDate } = proposal;

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
            done: (now.isAfter(proposal.startDate) && now.isBefore(proposal.endDate)) || (!isCanceled && !isHappening && !isUpcoming && !isExecuted) || isExecuted,
            timestamp: proposal.startDate,
            show: true,
        },
        succeeded: {
            done: (!isCanceled && !isHappening && !isUpcoming && !isExecuted  || isExecuted) && !(!executionTimestamp && now.isAfter(executionEpochEndDate)) ,
            timestamp: proposal.endDate,
            show: (!(isCanceled || isHappening || isUpcoming || isExecuted)  || isExecuted) && !(!executionTimestamp && now.isAfter(executionEpochEndDate)),
        },
        failed: {
            done: isCanceled || (!executionTimestamp && now.isAfter(executionEpochEndDate)),
            timestamp: proposal.endDate,
            show: isCanceled || (!executionTimestamp && now.isAfter(executionEpochEndDate)),
        },
        queued: {
            done: (!isCanceled && !isHappening && !isUpcoming  || isExecuted) && !(!proposal.executionTimestamp && now.isAfter(executionEpochEndDate)),
            timestamp: proposal.endDate,
            show: !(isCanceled || isHappening || isUpcoming || isExecuted) || isExecuted && !(!executionTimestamp && now.isAfter(executionEpochEndDate)),
        },
        executed: {
            done: isExecuted && !(!proposal.executionTimestamp && now.isAfter(executionEpochEndDate)),
            timestamp: executionTimestamp,
            show: (!(isCanceled || isHappening || isUpcoming || isExecuted)  || isExecuted) && !(!executionTimestamp && now.isAfter(executionEpochEndDate)),
        },
    };

    return (
        <StakingPageLayout isHome={false} title="0x Treasury">
            <RegisterBanner />
            <DocumentTitle {...documentConstants.VOTE} />
             <Section maxWidth="1170px" isFlex={true}>
                 <Column width="55%" maxWidth="560px">
                     <Countdown deadline={deadlineToVote} />
                     <Tag>Treasury</Tag>
                     <Heading size="medium" marginBottom="0px">{(heading as Tokens.Heading).text}</Heading>
                     <StyledText fontColor={colors.textDarkSecondary} fontSize="18px" fontWeight={300} fontFamily="Formular">Submitted by: {utils.getAddressBeginAndEnd(proposal.proposer)}</StyledText>
                     <Paragraph>
                         <StyledMarkdown>
                             <ReactMarkdown children={description.replace(heading.raw, '')} />
                         </StyledMarkdown>
                     </Paragraph>
                 </Column>
                 <Column width="30%" maxWidth="300px">
                    <Text fontColor={colors.textDarkSecondary} fontSize="18px" fontWeight={300} fontFamily="Formular" />
                     {tally && <VoteStats tally={tally} />}
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
                                            <Tick isActive={historyState.done} isFailed={state === 'failed'}><img src={state === 'failed' ? '/images/governance/cross.svg' : '/images/governance/tick_mark.svg'} /></Tick>
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
                                        <CellContent key={state}>
                                            <StateTitle fontColor={colors.textDarkSecondary} fontFamily="Formular" fontSize="18px" fontWeight={400}>{state}</StateTitle>
                                            <Text fontColor={colors.textDarkSecondary} fontFamily="Formular" fontSize="17px" fontWeight={300}>{historyState.done ? historyState.timestamp.format('MMMM Do, YYYY - hh:mm a') : 'TBD'}</Text>
                                        </CellContent>
                                    );
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
    width: 80px;
    font-size: 17px;
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
    height: 29px;
    width: 29px;
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
