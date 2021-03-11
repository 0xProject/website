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
    order: number;
    description: string;
    tally?: TallyInterface;
    status?: string;
}

type VoteIndexCardProps = ZEIPCardProps | TreasuryCardProps;

// export interface VoteIndexCardProps {

// }

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
    const pstOffset = '-0800';
    const now = moment();
    const endDate = voteEndDate.utcOffset(pstOffset);
    const startDate = voteStartDate.utcOffset(pstOffset);
    const timeToEndInDays = endDate.diff(now, 'days');
    const timeToEndInHours = endDate.diff(now, 'hours');
    if (voteTime === 'happening') {
        return `Voting ends in ${timeToEndInDays > 1 ? timeToEndInDays : timeToEndInHours} ${timeToEndInDays > 1 ? 'days' : 'hours' }`;
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

export const VoteIndexCard: React.StatelessComponent<VoteIndexCardProps> = props => {
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
                executed: isExecuted,
                upcoming: isUpcoming,
                happening: isHappening,
                timestamp,
                startDate,
                endDate,
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
                                <Tag>Treasury</Tag>
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
                            <Column width="25%">
                                <div className="flex flex-column sm-col-12">
                                    <VoteStatusText
                                        status={getStatus(
                                            isCanceled,
                                            isExecuted,
                                            isUpcoming,
                                        )}
                                    />
                                    {
                                        isHappening ? (
                                            <VoteStats tally={tally} isVoteCard={true} />
                                        ) :
                                            (

                                                <Paragraph marginBottom="12px" color={colors.textDarkPrimary}>
                                                    {`${totalBalances} ZRX Total Vote`}
                                                </Paragraph>
                                            )
                                    }
                                    <Paragraph marginBottom="12px">
                                        {getDateString(startDate, endDate)}
                                    </Paragraph>
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
                                <Tag className="zeip">ZEIP</Tag>
                                <Heading>
                                    {`${title} `}
                                    <Muted>{`(ZEIP-${zeipId})`}</Muted>
                                </Heading>

                                <Paragraph>{summary[0]}</Paragraph>
                            </Column>
                            <Column width="25%" className="flex flex-column justify-center">
                                <div className="flex flex-column sm-col-12">
                                    <VoteStatusText status={voteStatus} />
                                    {
                                        voteStatus === 'happening' ? (
                                            <VoteStats tally={tally} isVoteCard={true} />
                                        ) :
                                        <Paragraph marginBottom="12px" color={colors.textDarkPrimary}>
                                            {`${totalBalances} ZRX Total Vote`}
                                        </Paragraph>
                                    }
                                    <Paragraph marginBottom="12px">
                                        {getDateString(voteStartDate, voteEndDate)}
                                    </Paragraph>
                                </div>
                            </Column>
                        </FlexWrap>
                    </Section>
                </ReactRouterLink>
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
    background-color: ${() => colors.brandLight};
    color: ${() => colors.white};
    width: 60px;
    font-size: 14px;

    &.zeip {
        width: 40px;
        background-color: ${() => colors.yellow500};
    }
`;

const shimmer = keyframes`
  to {
    background-position:
     150% 0;
  }
`;

const VoteCardShimmer = styled.div`
    padding-top: 16px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .shimmer {
        background-repeat: no-repeat;
        background: linear-gradient(90deg, ${() => colors.grey50} 0, ${() => colors.grey300} 50%, ${() => colors.grey50} 100%) no-repeat, ${() => colors.grey50};
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
