import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
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
import { TreasuryContext } from 'ts/pages/governance/vote_index';
import { VoteStats } from 'ts/pages/governance/vote_stats';
import { colors } from 'ts/style/colors';
import { WebsitePaths } from 'ts/types';
import { configs } from 'ts/utils/configs';
import { documentConstants } from 'ts/utils/document_meta_constants';

export const Treasury: React.FC<{}> = () => {
    // public state: State = {
    //     isVoteModalOpen: false,
    //     isVoteReceived: false,
    //     providerName: 'Metamask',
    // };
    // const _proposalData: Proposal;
    const [proposal, setProposal] = React.useState<TreasuryProposal>();
    const [isProposalsLoaded, setProposalsLoaded] = React.useState<boolean>(false);
    const [isVoteReceived] = React.useState<boolean>(false);
    const [isVoteModalOpen] = React.useState<boolean>(false);
    const { proposalId } = useParams();
    const { proposals } = React.useContext(TreasuryContext);

    React.useEffect(() => {
        if (proposals) {
            const currentProposal = proposals.find(p => p.id === parseInt(proposalId, 10));
            setProposal(currentProposal);
            setProposalsLoaded(true);
        }
        // tslint:disable:no-shadowed-variable
    }, [proposals]);

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

    // const { isVoteReceived, tally } = this.state;
    const { forVotes, againstVotes, timestamp, happening: isHappening, description, id } = proposal;
    const tally = {
        no: new BigNumber(againstVotes.toString()),
        yes: new BigNumber(forVotes.toString()),
    };

    const pstOffset = '-0800';
    const deadlineToVote = moment(timestamp)?.utcOffset(pstOffset);
    //     const voteStartDate = proposalData?.voteStartDate?.utcOffset(pstOffset);
    // const hasVoteEnded = canceled || executed;
    // const hasVoteStarted = happening;
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
                    <VoteStats tally={tally} />
                    {isVoteActive && (
                        <VoteButton onClick={() => onOpenVoteModal()} isWithArrow={false}>
                            {isVoteReceived ? 'Vote Received' : 'Vote'}
                        </VoteButton>
                    )}
                </Column>
            </Section>

            <Section bgColor="light" maxWidth="1170px">
                {/* <SectionWrap>
                        <Heading>{proposalData.benefit.title}</Heading>
                        <FlexWrap>
                            <Column width="55%" maxWidth="560px">
                                {_.map(proposalData.benefit.summary, (link, index) => (
                                    <Paragraph key={`benefittext-${index}`}>
                                        {proposalData.benefit.summary[index]}
                                    </Paragraph>
                                ))}
                                {_.map(proposalData.benefit.links, (link, index) => (
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
                                    rating={proposalData.benefit.rating}
                                />
                            </Column>
                        </FlexWrap>
                    </SectionWrap>
                    <SectionWrap>
                        <Heading>{proposalData.risks.title}</Heading>
                        <FlexWrap>
                            <Column width="55%" maxWidth="560px">
                                {_.map(proposalData.risks.summary, (link, index) => (
                                    <Paragraph key={`risktext-${index}`}>
                                        {proposalData.risks.summary[index]}
                                    </Paragraph>
                                ))}
                                {_.map(proposalData.risks.links, (link, index) => (
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
                                    rating={proposalData.risks.rating}
                                />
                            </Column>
                        </FlexWrap>
                    </SectionWrap> */}
            </Section>

            {isVoteActive && (
                <Banner
                    heading={`Vote with ZRX Proposal ${id}`}
                    subline="Use 0x Instant to quickly purchase ZRX for voting"
                    mainCta={{ text: 'Get ZRX', onClick: () => onLaunchInstantClick() }}
                    secondaryCta={{ text: 'Vote', onClick: () => onOpenVoteModal() }}
                />
            )}
            <ModalVote
                zeipId={id}
                isOpen={isVoteModalOpen}
                onDismiss={onDismissVoteModal}
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
