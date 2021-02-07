import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

import { Column, FlexWrap, Section } from 'ts/components/newLayout';
import { Heading, Paragraph } from 'ts/components/text';
import { getTotalBalancesString } from 'ts/pages/governance/vote_stats';
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
    const now = moment();
    const endDate = voteEndDate.utcOffset(pstOffset);
    const startDate = voteStartDate.utcOffset(pstOffset);
    const timeToEndInDays = endDate.diff(now, 'days');
    const timeToEndInHours = endDate.diff(now, 'hours');
    if (voteTime === 'happening') {
        return `Voting ends in ${timeToEndInDays > 1 ? timeToEndInDays + ' days' : timeToEndInHours + ' hours' }`;
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

const getVotesPercentage = (votes: BigNumber, totalVotes: BigNumber): number => {
    if(votes.isLessThanOrEqualTo(0) || totalVotes.isLessThanOrEqualTo(0)) {
        return 0;
    }

    const percentage = votes.dividedBy(totalVotes).toFixed(2);
    return parseFloat(percentage) * 100;
}

export const VoteIndexCard: React.StatelessComponent<VoteIndexCardProps> = props => {
    const { order, tally } = props;

    let totalBalances;
    let totalVotes;
    let noVotesPercentage;
    let yesVotesPercentage;

    if(tally) {
        totalBalances = getTotalBalancesString(tally);
        totalVotes = tally.yes.plus(tally.no);
        noVotesPercentage = getVotesPercentage(tally.no, totalVotes);
        yesVotesPercentage = getVotesPercentage(tally.yes, totalVotes);
        console.log(totalVotes.toNumber(), noVotesPercentage);
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
            } = props;
            return (
                <ReactRouterLink style={{ order }} to={`${WebsitePaths.Vote}/treasury/${id}`}>
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
                                        <Heading marginBottom="20px">{`${description.length < 200 ? description : description.slice(0, 200) + '...'}`}</Heading>

                                        <Paragraph>{`${description.length < 200 ? description : description.slice(0, 200) + '...'}`}</Paragraph>
                                    </>
                                ) : (
                                    <VoteCardShimmer>
                                        <div className="title shimmer" />
                                        <div className="description">
                                            <div className="line shimmer"></div>
                                            <div className="line shimmer"></div>
                                            <div className="line shimmer"></div>
                                        </div>

                                    </VoteCardShimmer>
                                )}
                            </Column>
                            <Column width='25%'>
                                <div className="flex flex-column items-end">
                                    <VoteStatusText
                                        status={getStatus(
                                            isCanceled,
                                            isExecuted,
                                            isUpcoming,
                                        )}
                                    />
                                    {
                                        isHappening ? (
                                            <>
                                                <StyledParagraph color={colors.textDarkPrimary} marginBottom='12px'>
                                                    <CountTitle>Yes</CountTitle>
                                                    <PercentageContainer>
                                                        <VotePercentage value={yesVotesPercentage} color={colors.brandLight} />
                                                    </PercentageContainer>
                                                    {yesVotesPercentage}%
                                                </StyledParagraph>
                                                <StyledParagraph color={colors.textDarkPrimary}>
                                                    <CountTitle>No</CountTitle>
                                                    <PercentageContainer>
                                                        <VotePercentage value={noVotesPercentage} color={colors.brandDark} />
                                                    </PercentageContainer>
                                                    {noVotesPercentage}%
                                                </StyledParagraph>
                                            </>
                                        ) :
                                            (

                                                <Paragraph marginBottom="12px" color={colors.textDarkPrimary}>
                                                    {`${totalBalances} ZRX Total Vote`}
                                                </Paragraph>
                                            )
                                    }
                                    <Paragraph marginBottom="12px">
                                        {timestamp && (isExecuted || isCanceled)
                                            ? `Ended ${timestamp.format('MMM DD, YYYY')}`
                                            : isHappening
                                            ? `Voting ends in ${timestamp.diff(moment(), 'days')} days`
                                            : `Upcoming in ${timestamp.diff(moment(), 'days')} days`}
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
                            <Column width='25%'>
                                <div className="flex flex-column items-end">
                                    <VoteStatusText status={voteStatus} />
                                    {
                                        voteStatus === 'happening' ? (
                                            <>
                                                <StyledParagraph color={colors.textDarkPrimary} marginBottom='12px'>
                                                    <CountTitle>Yes</CountTitle>
                                                    <PercentageContainer>
                                                        <VotePercentage value={yesVotesPercentage} color={colors.brandLight} />
                                                    </PercentageContainer>
                                                    {yesVotesPercentage}%
                                                </StyledParagraph>
                                                <StyledParagraph color={colors.textDarkPrimary}>
                                                    <CountTitle>No</CountTitle>
                                                    <PercentageContainer>
                                                        <VotePercentage value={noVotesPercentage} color={colors.brandDark} />
                                                    </PercentageContainer>
                                                    {noVotesPercentage}%
                                                </StyledParagraph>
                                            </>
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
    font-size: 12px;

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

const VoteCounts = styled.div`
`;

const StyledParagraph = styled<any>(Paragraph)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const CountTitle = styled.div`
    width: 30px;
`

const PercentageContainer = styled.div`
    flex: 1;
`;

const VotePercentage = styled.div<{value: number, color: string}>`
    height: 15px;
    width: ${({value}) => value || 1}%;
    background-color: ${({ color }) => color};
    margin: 0 8px;
`;
