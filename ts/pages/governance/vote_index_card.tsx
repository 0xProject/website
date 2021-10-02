import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { TreasurySummary } from 'ts/components/governance/treasury_summary';
import { Column, FlexWrap, Section } from 'ts/components/newLayout';
import { Heading, Paragraph } from 'ts/components/text';
import { getTotalBalancesString, VoteStats } from 'ts/pages/governance/vote_stats';
import { VoteStatusText } from 'ts/pages/governance/vote_status_text';
import { colors } from 'ts/style/colors';
import { TallyInterface, VoteOutcome, VoteTime, VotingCardType, WebsitePaths } from 'ts/types';

interface ZEIPCardProps {
    type: VotingCardType.Zeip;
    title: string;
    zeipId: number;
    summary: string[];
    voteStartDate: moment.Moment;
    voteEndDate: moment.Moment;
    order?: number;
    // Non-static properties
    tally?: TallyInterface;
}

interface TreasuryCardProps {
    id: number;
    type: VotingCardType.Treasury;
    canceled: boolean;
    executed: boolean;
    upcoming: boolean;
    happening: boolean;
    timestamp: moment.Moment;
    order?: number;
    description: string;
    tally?: TallyInterface;
    status?: string;
    quorumThreshold: BigNumber;
    startDate: moment.Moment;
    endDate: moment.Moment;
    forVotes: BigNumber;
    againstVotes: BigNumber;
}

interface SnapshotCardProps {
    id: string;
    type: VotingCardType.Snapshot;
    votes?: any[];
    title: string;
    choices: string[];
    body: string;
    start: number;
    end: number;
    author: string;
    state: string;
    order?: number;
    tally?: TallyInterface;
}

type VoteIndexCardProps = ZEIPCardProps | TreasuryCardProps | SnapshotCardProps;

const getVoteTime = (voteStartDate: moment.Moment, voteEndDate: moment.Moment): VoteTime | undefined => {
    const now = moment();
    if (now.isBefore(voteEndDate) && now.isAfter(voteStartDate)) {
        return 'happening';
    }
    if (now.isBefore(voteStartDate)) {
        return 'upcoming';
    }
    return undefined;
};

export const getVoteOutcome = (tally?: TallyInterface): VoteOutcome | undefined => {
    if (!tally) {
        return undefined;
    }
    if (tally.no.isGreaterThanOrEqualTo(tally.yes)) {
        return 'rejected';
    } else if (tally.yes.isGreaterThan(tally.no)) {
        return 'accepted';
    }
    return undefined;
};

export const getDateString = (voteStartDate: moment.Moment, voteEndDate: moment.Moment): string => {
    const voteTime = getVoteTime(voteStartDate, voteEndDate);
    const pstOffset = '-0700';
    const now = moment();
    const endDate = voteEndDate.utcOffset(pstOffset);
    const startDate = voteStartDate.utcOffset(pstOffset);
    const timeToEndInDays = (endDate.diff(now, 'days') as number) + 1;
    const timeToEndInHours = endDate.diff(now, 'hours');
    if (voteTime === 'happening') {
        return `Voting ends in ${timeToEndInDays > 1 ? timeToEndInDays : timeToEndInHours} ${
            timeToEndInDays > 1 ? 'days' : 'hours'
        }`;
    }
    if (voteTime === 'upcoming') {
        return `Starting ${startDate.format('MMMM Do YYYY, h:mm a')} PST`;
    }
    return `Ended ${endDate.format('MMMM Do YYYY')}`;
};

const getStatus = (
    canceled: boolean,
    executed: boolean,
    upcoming: boolean,
): 'upcoming' | 'happening' | 'accepted' | 'rejected' => {
    if (canceled) {
        return 'rejected';
    } else if (executed) {
        return 'accepted';
    } else if (upcoming) {
        return 'upcoming';
    } else {
        return 'happening';
    }
};

export const VoteIndexCard: React.StatelessComponent<VoteIndexCardProps> = (props) => {
    const { order, tally } = props;

    let totalBalances;

    if (tally) {
        totalBalances = getTotalBalancesString(tally);
    }

    switch (props.type) {
        case VotingCardType.Treasury:
            const {
                id,
                description,
                canceled: isCanceled,
                upcoming: isUpcoming,
                happening: isHappening,
                startDate,
                endDate,
                againstVotes,
                forVotes,
                quorumThreshold,
            } = props;

            return (
                <ReactRouterLink style={{ order }} to={`${WebsitePaths.Vote}/proposal/${id}`}>
                    <Section
                        hasBorder={true}
                        bgColor="none"
                        padding="30px 30px 10px"
                        hasHover={true}
                        margin="30px auto"
                        maxWidth="100%"
                    >
                        <FlexWrap>
                            <Column width="60%" padding="0px 20px 0px 0px">
                                <TagsWrapper>
                                    <Tag>Treasury</Tag>
                                    <Tag className="gas-required">Gas Required</Tag>
                                </TagsWrapper>
                                {description ? (
                                    <>
                                        <TreasurySummary description={description} />
                                    </>
                                ) : (
                                    <VoteCardShimmer>
                                        <div className="title shimmer" />
                                        <div className="description">
                                            <div className="line shimmer" />
                                            <div className="line shimmer" />
                                            <div className="line shimmer" />
                                        </div>
                                    </VoteCardShimmer>
                                )}
                            </Column>
                            <Column width="25%" className="flex flex-column justify-center">
                                <div className="flex flex-column sm-col-12">
                                    <VoteStatusText
                                        status={getStatus(
                                            isCanceled,
                                            !isHappening && againstVotes < forVotes && forVotes > quorumThreshold,
                                            isUpcoming,
                                        )}
                                    />
                                    {isHappening ? (
                                        <VoteStats tally={tally} isVoteCard={true} />
                                    ) : (
                                        <Paragraph marginBottom="12px" color={colors.textDarkPrimary}>
                                            {`${totalBalances} ZRX Total Vote`}
                                        </Paragraph>
                                    )}
                                    <Paragraph marginBottom="12px">{getDateString(startDate, endDate)}</Paragraph>
                                </div>
                            </Column>
                        </FlexWrap>
                    </Section>
                </ReactRouterLink>
            );
        case VotingCardType.Zeip:
            const { title, zeipId, summary, voteStartDate, voteEndDate } = props;
            const voteTime = getVoteTime(voteStartDate, voteEndDate);
            const voteStatus = voteTime || getVoteOutcome(tally);
            return (
                <ReactRouterLink style={{ order }} to={`${WebsitePaths.Vote}/zeip-${zeipId}`}>
                    <Section
                        hasBorder={true}
                        bgColor="none"
                        padding="30px 30px 10px"
                        hasHover={true}
                        margin="30px auto"
                        maxWidth="100%"
                    >
                        <FlexWrap>
                            <Column width="60%" padding="0px 20px 0px 0px">
                                <TagsWrapper>
                                    <Tag className="zeip">ZEIP</Tag>
                                    <Tag className="freevote">Free Vote</Tag>
                                </TagsWrapper>
                                <Heading marginBottom="15px">
                                    {`${title} `}
                                    <Muted>{`(ZEIP-${zeipId})`}</Muted>
                                </Heading>

                                <Paragraph marginBottom="20px">{summary[0]}</Paragraph>
                            </Column>
                            <Column width="25%" className="flex flex-column justify-center">
                                <div className="flex flex-column sm-col-12">
                                    <VoteStatusText status={voteStatus} />
                                    {voteStatus === 'happening' ? (
                                        <VoteStats tally={tally} isVoteCard={true} />
                                    ) : (
                                        <Paragraph marginBottom="12px" color={colors.textDarkPrimary}>
                                            {`${totalBalances} ZRX Total Vote`}
                                        </Paragraph>
                                    )}
                                    <Paragraph marginBottom="12px">
                                        {getDateString(voteStartDate, voteEndDate)}
                                    </Paragraph>
                                </div>
                            </Column>
                        </FlexWrap>
                    </Section>
                </ReactRouterLink>
            );
        case VotingCardType.Snapshot:
            const snapshotText = props.body.length > 500 ? `${props.body.substring(0, 500)}...` : props.body;
            const status = props.state;

            const proposalState = status === 'active' ? 'happening' : 'accepted';
            return (
                <a style={{ order }} target="_blank" href={`https://snapshot.org/#/0xgov.eth/proposal/${props.id}`}>
                    <Section
                        hasBorder={true}
                        bgColor="none"
                        padding="30px 30px 10px"
                        hasHover={true}
                        margin="30px auto"
                        maxWidth="100%"
                    >
                        <FlexWrap>
                            <Column width="60%" padding="0px 20px 0px 0px">
                                <TagsWrapper>
                                    <Tag className="snapshot">Snapshot</Tag>
                                    <Tag className="freevote-snapshot">Free Vote</Tag>
                                </TagsWrapper>
                                <Heading marginBottom="15px">{`${props.title} `}</Heading>
                                {props.body ? (
                                    <>
                                        <Paragraph marginBottom="12px">{snapshotText}</Paragraph>
                                    </>
                                ) : (
                                    <VoteCardShimmer>
                                        <div className="title shimmer" />
                                        <div className="description">
                                            <div className="line shimmer" />
                                            <div className="line shimmer" />
                                            <div className="line shimmer" />
                                        </div>
                                    </VoteCardShimmer>
                                )}
                            </Column>
                            <Column width="25%" className="flex flex-column justify-center">
                                <div className="flex flex-column sm-col-12">
                                    <VoteStatusText status={proposalState} isSnapshot={true} />
                                    {/* {isHappening ? (
                                        <VoteStats tally={tally} isVoteCard={true} />
                                    ) : (
                                        <Paragraph marginBottom="12px" color={colors.textDarkPrimary}>
                                            {`${totalBalances} ZRX Total Vote`}
                                        </Paragraph>
                                    )} */}
                                    <Paragraph marginBottom="12px">
                                        {getDateString(moment.unix(props.start), moment.unix(props.end))}
                                    </Paragraph>
                                </div>
                            </Column>
                        </FlexWrap>
                    </Section>
                </a>
            );
        default:
            return null;
    }
};

const Muted = styled.span`
    opacity: 0.6;
`;

const Tag = styled.div`
    padding: 3px 2px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${() => colors.yellow500};
    color: ${() => colors.white};
    width: 80px;
    font-size: 17px;
    margin-bottom: 10px;

    &.zeip {
        width: 50px;
        background-color: ${() => colors.brandLight};
    }
    &.freevote {
        background-color: transparent;
        color: ${() => colors.brandLight};
        border: 1px solid ${() => colors.brandLight};
        width: 87px;
        margin-left: 6px;
    }

    &.gas-required {
        background-color: transparent;
        color: ${() => colors.yellow500};
        border: 1px solid ${() => colors.yellow500};
        width: 120px;
        margin-left: 6px;
    }

    &.freevote-snapshot {
        background-color: transparent;
        color: #0500fa;
        border: 1px solid #0500fa;
        width: 87px;
        margin-left: 6px;
    }
    &.snapshot {
        width: 90px;
        background-color: ${() => colors.blue700};
    }
`;

const shimmer = keyframes`
  to {
    background-position:
     150% 0;
  }
`;

const TagsWrapper = styled.div`
    display: flex;
`;

const VoteCardShimmer = styled.div`
    padding-top: 16px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .shimmer {
        background-repeat: no-repeat;
        background: linear-gradient(
                    90deg,
                    ${() => colors.grey50} 0,
                    ${() => colors.grey300} 50%,
                    ${() => colors.grey50} 100%
                )
                no-repeat,
            ${() => colors.grey50};
        background-size: 300% auto;
        background-position: -150% 0;
        animation: ${shimmer} 2.5s infinite ease-out;
        animation-direction: reverse;
    }

    .title {
        height: 20px;
        width: 100%;
    }

    .description {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .line {
            height: 10px;
            width: 100%;
        }
    }
`;
