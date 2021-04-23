import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { Banner } from 'ts/components/banner';
import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { Column, FlexWrap, Section } from 'ts/components/newLayout';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading, Paragraph } from 'ts/components/text';
import { Text } from 'ts/components/ui/text';
import { Countdown } from 'ts/pages/governance/countdown';
import { Proposal, proposals, stagingProposals } from 'ts/pages/governance/data';
import { ModalVote } from 'ts/pages/governance/modal_vote';
import { RatingBar } from 'ts/pages/governance/rating_bar';
import { VoteInfo, VoteValue } from 'ts/pages/governance/vote_form';
import { getVoteOutcome } from 'ts/pages/governance/vote_index_card';
import { VoteStats } from 'ts/pages/governance/vote_stats';
import { colors } from 'ts/style/colors';
import { TallyInterface } from 'ts/types';
import { configs } from 'ts/utils/configs';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { environments } from 'ts/utils/environments';

interface LabelInterface {
    [key: number]: string;
}

interface State {
    isVoteModalOpen: boolean;
    isVoteReceived: boolean;
    providerName?: string;
    tally?: TallyInterface;
}

const benefitLabels: LabelInterface = {
    1: 'Little Benefit',
    2: 'Medium Benefit',
    3: 'High Benefit',
};

const riskLabels: LabelInterface = {
    1: 'Low Risk',
    2: 'Medium Risk',
    3: 'High Risk',
};

type ProposalState = 'created' | 'active' | 'failed' | 'accepted';

export class Governance extends React.Component<RouteComponentProps<any>> {
    public state: State = {
        isVoteModalOpen: false,
        isVoteReceived: false,
        providerName: 'Metamask',
    };
    private readonly _proposalData: Proposal;
    constructor(props: RouteComponentProps<any>) {
        super(props);
        const zeipId = parseInt(props.match.params.zeip.split('-')[1], 10);
        this._proposalData = environments.isProduction() ? proposals[zeipId] : stagingProposals[zeipId];
    }
    public componentDidMount(): void {
        // tslint:disable:no-floating-promises
        this._fetchVoteStatusAsync();
    }
    public render(): React.ReactNode {
        const { isVoteReceived, tally } = this.state;

        const now = moment();
        const deadlineToVote = this._proposalData?.voteEndDate?.local();
        const voteStartDate = this._proposalData?.voteStartDate?.local();
        const hasVoteEnded = deadlineToVote?.isBefore(now) || false;
        const hasVoteStarted = voteStartDate ? now.isAfter(voteStartDate) : false;
        const isVoteActive = hasVoteStarted && !hasVoteEnded;

        const outcome = getVoteOutcome(tally);

        const proposalHistoryState = {
            active: {
                done: now.isAfter(voteStartDate),
                timestamp: voteStartDate,
                show: true,
            },
            finalized: {
                done: hasVoteEnded && (outcome === 'rejected' || outcome === 'accepted'),
                timestamp: this._proposalData?.voteEndDate,
                outcome,
                show: true,
            },
        };

        return (
            <StakingPageLayout isHome={false} title="0x Governance">
                <DocumentTitle {...documentConstants.VOTE} />
                <Section maxWidth="1170px" isFlex={true}>
                    <Column width="55%" maxWidth="560px">
                        <Countdown
                            startDate={this._proposalData.voteStartDate}
                            endDate={this._proposalData.voteEndDate}
                        />
                        <Heading size="medium">{this._proposalData.title}</Heading>
                        {_.map(this._proposalData.summary, (link, index) => (
                            <Paragraph key={`summarytext-${index}`}>{this._proposalData.summary[index]}</Paragraph>
                        ))}
                        <Button
                            href={this._proposalData.url}
                            target={this._proposalData.url !== undefined ? '_blank' : undefined}
                            isWithArrow={true}
                            isAccentColor={true}
                        >
                            Learn More
                        </Button>
                    </Column>
                    <Column width="30%" maxWidth="300px">
                        <VoteStats tally={tally} />
                        {isVoteActive && (
                            <VoteButton onClick={this._onOpenVoteModal.bind(this)} isWithArrow={false}>
                                {isVoteReceived ? 'Vote Received' : 'Vote'}
                            </VoteButton>
                        )}

                        <Heading>Proposal History</Heading>
                        <ProposalHistory>
                            <Ticks>
                                {Object.keys(proposalHistoryState).map((state: string) => {
                                    const historyState = proposalHistoryState[state as ProposalState];
                                    console.log(historyState, state);
                                    if (!historyState.show) {
                                        return null;
                                    }
                                    return (
                                        <>
                                            <Tick isActive={historyState.done} isFailed={state === 'failed'}>
                                                <img
                                                    src={
                                                        state === 'failed'
                                                            ? '/images/governance/cross.svg'
                                                            : '/images/governance/tick_mark.svg'
                                                    }
                                                />
                                            </Tick>
                                            {!['accepted', 'failed', 'finalized'].includes(state) && (
                                                <Connector className={state === 'active' ? 'small' : ''} />
                                            )}
                                        </>
                                    );
                                })}
                            </Ticks>
                            <HistoryCells>
                                {Object.keys(proposalHistoryState).map((state: string) => {
                                    const historyState = proposalHistoryState[state as ProposalState];
                                    console.log(historyState);
                                    if (!historyState.show) {
                                        return null;
                                    }
                                    return (
                                        <CellContent key={state}>
                                            <StateTitle
                                                fontColor={colors.textDarkSecondary}
                                                fontFamily="Formular"
                                                fontSize="18px"
                                                fontWeight={400}
                                            >
                                                {state}
                                                {historyState.done &&
                                                (historyState.outcome === 'rejected' ||
                                                    historyState.outcome === 'accepted')
                                                    ? ` - ${historyState.outcome}`
                                                    : ''}
                                            </StateTitle>
                                            <Text
                                                fontColor={colors.textDarkSecondary}
                                                fontFamily="Formular"
                                                fontSize="17px"
                                                fontWeight={300}
                                            >
                                                <div></div>
                                                {historyState.done
                                                    ? `${historyState.timestamp.format('MMMM Do, YYYY - hh:mm a')}`
                                                    : 'TBD'}
                                            </Text>
                                        </CellContent>
                                    );
                                })}
                            </HistoryCells>
                        </ProposalHistory>
                    </Column>
                </Section>

                <Section bgColor="light" maxWidth="1170px">
                    <SectionWrap>
                        <Heading>{this._proposalData.benefit.title}</Heading>
                        <FlexWrap>
                            <Column width="55%" maxWidth="560px">
                                {_.map(this._proposalData.benefit.summary, (link, index) => (
                                    <Paragraph key={`benefittext-${index}`}>
                                        {this._proposalData.benefit.summary[index]}
                                    </Paragraph>
                                ))}
                                {_.map(this._proposalData.benefit.links, (link, index) => (
                                    <MoreLink
                                        href={link.url}
                                        target={link.url !== undefined ? '_blank' : undefined}
                                        isWithArrow={true}
                                        isAccentColor={true}
                                        key={`benefitlink-${index}`}
                                    >
                                        {link.text}
                                    </MoreLink>
                                ))}
                            </Column>
                            <Column width="30%" maxWidth="360px">
                                <RatingBar
                                    color={colors.brandLight}
                                    labels={benefitLabels}
                                    rating={this._proposalData.benefit.rating}
                                />
                            </Column>
                        </FlexWrap>
                    </SectionWrap>
                    <SectionWrap>
                        <Heading>{this._proposalData.risks.title}</Heading>
                        <FlexWrap>
                            <Column width="55%" maxWidth="560px">
                                {_.map(this._proposalData.risks.summary, (link, index) => (
                                    <Paragraph key={`risktext-${index}`}>
                                        {this._proposalData.risks.summary[index]}
                                    </Paragraph>
                                ))}
                                {_.map(this._proposalData.risks.links, (link, index) => (
                                    <div key={`risklink-${index}`}>
                                        <MoreLink
                                            href={link.url}
                                            target={link.url !== undefined ? '_blank' : undefined}
                                            isWithArrow={true}
                                            isAccentColor={true}
                                        >
                                            {link.text}
                                        </MoreLink>
                                        <br />
                                    </div>
                                ))}
                            </Column>
                            <Column width="30%" maxWidth="360px">
                                <RatingBar
                                    color="#AE5400"
                                    labels={riskLabels}
                                    rating={this._proposalData.risks.rating}
                                />
                            </Column>
                        </FlexWrap>
                    </SectionWrap>
                </Section>

                {isVoteActive && (
                    <Banner
                        heading={`Vote with ZRX on ZEIP-${this._proposalData.zeipId}`}
                        subline="Use 0x Instant to quickly purchase ZRX for voting"
                        mainCta={{ text: 'Get ZRX', onClick: this._onLaunchInstantClick.bind(this) }}
                        secondaryCta={{ text: 'Vote', onClick: this._onOpenVoteModal.bind(this) }}
                    />
                )}
                <ModalVote
                    zeipId={this._proposalData.zeipId}
                    isOpen={this.state.isVoteModalOpen}
                    onDismiss={this._onDismissVoteModal}
                    onVoted={this._onVoteReceived.bind(this)}
                />
            </StakingPageLayout>
        );
    }

    private readonly _onLaunchInstantClick = (): void => {
        (window as any).zeroExInstant.render(
            {
                orderSource: configs.VOTE_INSTANT_ORDER_SOURCE,
                availableAssetDatas: configs.VOTE_INSTANT_ASSET_DATAS,
                defaultSelectedAssetData: configs.VOTE_INSTANT_ASSET_DATAS[0],
            },
            'body',
        );
    };

    private readonly _onOpenVoteModal = (): void => {
        this.setState({ ...this.state, isVoteModalOpen: true });
    };

    private readonly _onDismissVoteModal = (): void => {
        this.setState({ ...this.state, isVoteModalOpen: false });
    };

    private readonly _onVoteReceived = (voteInfo: VoteInfo): void => {
        const { userBalance, voteValue } = voteInfo;
        const tally = { ...this.state.tally };

        if (voteValue === VoteValue.Yes) {
            tally.yes = tally.yes.plus(userBalance);
        } else {
            tally.no = tally.no.plus(userBalance);
        }

        this.setState({ ...this.state, isVoteReceived: true, tally });
    };
    private async _fetchVoteStatusAsync(): Promise<void> {
        try {
            const voteDomain = environments.isProduction()
                ? `https://${configs.DOMAIN_VOTE}`
                : `https://${configs.DOMAIN_VOTE_STAGING}`;
            const voteEndpoint = `${voteDomain}/v1/tally/${this._proposalData.zeipId}`;
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
            const totalBalance = yes.plus(no);
            const tally = {
                ...responseData,
                yes: new BigNumber(yes),
                no: new BigNumber(no),
                totalBalance,
            };

            this.setState({ ...this.state, tally });
        } catch (e) {
            // Empty block
        }
    }
}

const SectionWrap = styled.div`
    & + & {
        padding-top: 50px;
    }
`;

const VoteButton = styled(Button)`
    display: block;
    margin-bottom: 40px;
    width: 100%;
    max-width: 205px;
    color: white;
`;

const MoreLink = styled(Button)`
    & + & {
        margin-left: 30px;
    }
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
    height: 35px;
    width: 35px;
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
