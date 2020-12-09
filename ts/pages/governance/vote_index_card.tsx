import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import styled from 'styled-components';

import { Column, FlexWrap, Section } from 'ts/components/newLayout';
import { Heading, Paragraph } from 'ts/components/text';
import { getTotalBalancesString } from 'ts/pages/governance/vote_stats';
import { VoteStatusText } from 'ts/pages/governance/vote_status_text';
import { TallyInterface, VoteOutcome, VoteTime, WebsitePaths, VotingCardType } from 'ts/types';

type ZEIPCardProps = {
    type: VotingCardType.ZEIP;
    title: string;
    zeipId: number;
    summary: string[];
    voteStartDate: moment.Moment;
    voteEndDate: moment.Moment;
    order: number;
    // Non-static properties
    tally?: TallyInterface;
};

type TreasuryCardProps = {
    id: number;
    type: VotingCardType.TREASURY;
    canceled: boolean;
    executed: boolean;
    upcoming: boolean;
    happening: boolean;
    timestamp: moment.Moment;
    order: number;
    description: string;
    tally?: TallyInterface;
};
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

const getVoteOutcome = (tally?: TallyInterface): VoteOutcome | undefined => {
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

const getDateString = (voteStartDate: moment.Moment, voteEndDate: moment.Moment): string => {
    const voteTime = getVoteTime(voteStartDate, voteEndDate);
    const pstOffset = '-0800';
    const endDate = voteEndDate.utcOffset(pstOffset);
    const startDate = voteStartDate.utcOffset(pstOffset);
    if (voteTime === 'happening') {
        return `Ends ${endDate.format('MMMM Do YYYY, h:mm a')} PST`;
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
    switch (props.type) {
        case VotingCardType.TREASURY:
            const { id, description, canceled, executed, upcoming, happening, timestamp } = props;
            return (
                <ReactRouterLink style={{ order }} to={`${WebsitePaths.Vote}/treasury/${id}`}>
                    <Section
                        hasBorder={true}
                        bgColor="none"
                        padding="30px 30px 10px"
                        hasHover={true}
                        margin="30px auto"
                        maxWidth="100%"
                        order={order}
                    >
                        <FlexWrap>
                            <Column width="60%" padding="0px 20px 0px 0px">
                                <Heading>{`${description.slice(0, 20)}...`}</Heading>

                                <Paragraph>{description}</Paragraph>
                            </Column>
                            <Column>
                                <div className="flex flex-column items-end">
                                    <VoteStatusText status={getStatus(canceled, executed, upcoming)} />
                                    <Paragraph marginBottom="12px" isMuted={1}>{`${tally.yes.plus(
                                        tally.no,
                                    )} ZRX Total Vote`}</Paragraph>
                                    <Paragraph marginBottom="12px">
                                        {executed || canceled
                                            ? `Ended ${timestamp.format('MMM DD, YYYY')}`
                                            : happening
                                            ? `Ends in ${timestamp.diff(moment(), 'days')} days`
                                            : `Upcoming in ${timestamp.diff(moment(), 'days')} days`}
                                    </Paragraph>
                                </div>
                            </Column>
                        </FlexWrap>
                    </Section>
                </ReactRouterLink>
            );
        case VotingCardType.ZEIP:
            const { title, zeipId, summary, voteStartDate, voteEndDate } = props;
            const voteTime = getVoteTime(voteStartDate, voteEndDate);
            const voteStatus = voteTime || getVoteOutcome(tally);
            const totalBalances = getTotalBalancesString(tally);
            return (
                <ReactRouterLink style={{ order }} to={`${WebsitePaths.Vote}/zeip-${zeipId}`}>
                    <Section
                        hasBorder={true}
                        bgColor="none"
                        padding="30px 30px 10px"
                        hasHover={true}
                        margin="30px auto"
                        maxWidth="100%"
                        order={order}
                    >
                        <FlexWrap>
                            <Column width="60%" padding="0px 20px 0px 0px">
                                <Heading>
                                    {`${title} `}
                                    <Muted>{`(ZEIP-${zeipId})`}</Muted>
                                </Heading>

                                <Paragraph>{summary[0]}</Paragraph>
                            </Column>
                            <Column>
                                <div className="flex flex-column items-end">
                                    <VoteStatusText status={voteStatus} />
                                    <Paragraph
                                        marginBottom="12px"
                                        isMuted={1}
                                    >{`${totalBalances} ZRX Total Vote`}</Paragraph>
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
