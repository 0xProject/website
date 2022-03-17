import { ZrxTreasuryContract } from '@0x/contracts-treasury';
import { BigNumber } from '@0x/utils';
import { gql, request } from 'graphql-request';
import * as _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import moment from 'moment';
import * as React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { fadeIn } from 'ts/style/keyframes';

import { Web3Wrapper } from '@0x/web3-wrapper';

import { backendClient } from 'ts/utils/backend_client';

import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { GovernanceHero } from 'ts/components/governance/hero';
import { RegisterBanner } from 'ts/components/governance/register_banner';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Text } from 'ts/components/ui/text';
import { Proposal, proposals as prodProposals, stagingProposals, TreasuryProposal } from 'ts/pages/governance/data';
import { VoteIndexCard } from 'ts/pages/governance/vote_index_card';
import { State } from 'ts/redux/reducer';
import { colors } from 'ts/style/colors';
import { OnChainProposal, TallyInterface, VotingCardType } from 'ts/types';
import { configs, GOVERNANCE_THEGRAPH_ENDPOINT, GOVERNOR_CONTRACT_ADDRESS } from 'ts/utils/configs';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { environments } from 'ts/utils/environments';
import { Heading } from 'ts/components/text';
import ForumThreadCard from './forum_thread_card';
import { getTopNPosts } from 'ts/utils/forum_client';
import { useAsync } from 'react-use';

const FETCH_PROPOSALS = gql`
    query proposals {
        proposals(orderDirection: desc) {
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

type ProposalWithOrder = Proposal & {
    order?: number;
};

type TreasuryProposalWithOrder = TreasuryProposal & {
    order?: number;
};

interface IInputProps {
    isSubmitted: boolean;
    name: string;
    type: string;
    label: string;
    color?: string;
    required?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IArrowProps {
    isSubmitted: boolean;
}

interface SnapshotProposals {
    id: string;
    votes?: any[];
    title: string;
    choices: string[];
    body: string;
    start: number;
    end: number;
    author: string;
    state: string;
    order?: number;
}

const PROPOSALS = environments.isProduction() ? prodProposals : stagingProposals;
const ZEIP_IDS = Object.keys(PROPOSALS).map((idString) => parseInt(idString, 10));
const ZEIP_PROPOSALS: ProposalWithOrder[] = ZEIP_IDS.map((id) => PROPOSALS[id]).sort(
    (a, b) => b.voteStartDate.unix() - a.voteStartDate.unix(),
);

export interface VoteIndexProps {}

interface ZeipTallyMap {
    [id: number]: TallyInterface;
}

const fetchVoteStatusAsync: (zeipId: number) => Promise<TallyInterface> = async (zeipId) => {
    try {
        const voteDomain = environments.isProduction()
            ? `https://${configs.DOMAIN_VOTE}`
            : `https://${configs.DOMAIN_VOTE_STAGING}`;
        const voteEndpoint = `${voteDomain}/v1/tally/${zeipId}`;
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
        const tally = {
            ...responseData,
            yes: new BigNumber(yes),
            no: new BigNumber(no),
        };
        return tally;
    } catch (e) {
        // Empty block
        return {
            yes: new BigNumber(0),
            no: new BigNumber(0),
        };
    }
};

const sortProposals = (
    onChainProposals: Proposals[],
    zeipProposals: Proposal[],
    snapshotProposals: SnapshotProposals[],
) => {
    // aggregate all proposals
    const allData = [...onChainProposals, ...zeipProposals, ...snapshotProposals];

    // sort aggregated proposals
    const allDataSorted = allData.sort((propA: Proposals, propB: Proposals) => {
        const aStart = propA.startDate
            ? propA.startDate
            : propA.voteStartDate
            ? propA.voteStartDate
            : moment.unix(propA.start);
        const bStart = propB.startDate
            ? propB.startDate
            : propB.voteStartDate
            ? propB.voteStartDate
            : moment.unix(propB.start);
        return bStart.diff(aStart);
    });

    // set overall order based on aggregated sorting
    allDataSorted.forEach((proposal: Proposals, index) => {
        if (proposal.zeipId) {
            const foundIndex = ZEIP_PROPOSALS.findIndex((p) => {
                return p.zeipId === proposal.zeipId;
            });
            ZEIP_PROPOSALS[foundIndex].order = index;
        } else {
            if (proposal.startDate) {
                const foundIndex = onChainProposals.findIndex((p) => {
                    return p.id === proposal.id;
                });
                onChainProposals[foundIndex].order = index;
            } else {
                const foundIndex = snapshotProposals.findIndex((p) => {
                    return p.id === proposal.id;
                });
                snapshotProposals[foundIndex].order = index;
            }
        }
    });
};

const fetchTallysAsync: () => Promise<ZeipTallyMap> = async () => {
    const tallyResponses = await Promise.all(ZEIP_IDS.map(async (zeipId) => fetchVoteStatusAsync(zeipId)));
    const tallys: { [key: number]: TallyInterface } = {};
    ZEIP_IDS.forEach((zeipId, i) => (tallys[zeipId] = tallyResponses[i]));
    return tallys;
};

interface Proposals {
    [index: string]: any;
}

const Input = React.forwardRef((props: IInputProps, ref: React.Ref<HTMLInputElement>) => {
    const { name, label, type, onChange } = props;
    const id = `input-${name}`;

    return (
        <>
            <label className="visuallyHidden" htmlFor={id}>
                {label}
            </label>
            <StyledInput onChange={onChange} ref={ref} id={id} placeholder={label} type={type || 'text'} {...props} />
        </>
    );
});

export const VoteIndex: React.FC<VoteIndexProps> = () => {
    const [filter, setFilter] = React.useState<string>('all');
    const [tallys, setTallys] = React.useState<ZeipTallyMap>(undefined);
    const [proposals, setProposals] = React.useState<TreasuryProposalWithOrder[]>([]);
    const [snapshotProposals, setSnapshotProposals] = React.useState<SnapshotProposals[]>(undefined);
    const [quorumThreshold, setQuorumThreshold] = React.useState<BigNumber>();
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
    const providerState = useSelector((state: State) => state.providerState);

    const [email, setEmail] = React.useState<string>('');

    React.useEffect(() => {
        // tslint:disable-next-line: no-floating-promises
        (async () => {
            const proposalsAndVotes = await backendClient.getSnapshotProposalsAndVotesAsync();
            setSnapshotProposals(proposalsAndVotes);
        })();
    }, []);

    const { loading: postsLoading, error: postsError, value: posts } = useAsync(getTopNPosts, []);

    const { data, isLoading } = useQuery('proposals', async () => {
        const { proposals: treasuryProposals } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSALS);
        return treasuryProposals;
    });

    React.useEffect(() => {
        // tslint:disable-next-line: no-floating-promises
        (async () => {
            const tallyMap: ZeipTallyMap = await fetchTallysAsync();
            setTallys(tallyMap);
        })();
    }, []);

    React.useEffect(() => {
        const contract = new ZrxTreasuryContract(GOVERNOR_CONTRACT_ADDRESS.ZRX, providerState.provider);
        // tslint:disable-next-line: no-floating-promises
        (async () => {
            const qThreshold = await contract.quorumThreshold().callAsync();
            setQuorumThreshold(qThreshold);
        })();
    }, [providerState]);

    React.useEffect(() => {
        if (data && quorumThreshold && snapshotProposals) {
            const onChainProposals = data.map((proposal: OnChainProposal) => {
                const { id, votesAgainst, votesFor, description, executionTimestamp, voteEpoch } = proposal;
                const againstVotes = new BigNumber(votesAgainst);
                const forVotes = new BigNumber(votesFor);
                const bigNumStartTimestamp = new BigNumber(voteEpoch.startTimestamp);
                const startDate = moment.unix(bigNumStartTimestamp.toNumber());
                const endDate = startDate.clone();
                endDate.add(3, 'd');
                const now = moment();
                const isUpcoming = now.isBefore(startDate);
                const isHappening = now.isAfter(startDate) && now.isBefore(endDate);
                const timestamp = isHappening
                    ? endDate
                    : isUpcoming
                    ? startDate
                    : executionTimestamp
                    ? executionTimestamp
                    : endDate;

                return {
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
                };
            });
            sortProposals(onChainProposals.reverse(), ZEIP_PROPOSALS, snapshotProposals);
            setProposals(onChainProposals);
        }
    }, [data, quorumThreshold, snapshotProposals]);

    const applyFilter = (value: string) => {
        setFilter(value);
    };

    const getFilterName = (name: string): string => {
        switch (name) {
            case 'all':
                return 'Showing All';
            case 'zeip':
                return 'ZEIP';
            case 'treasury':
                return 'Treasury';
            default:
                return '';
        }
    };

    const onSubmit = React.useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!email) {
                return;
            }
            try {
                await backendClient.subscribeToNewsletterAsync({
                    email,
                    list: configs.STAKING_UPDATES_NEWSLETTER_ID,
                });
            } catch (err) {
                // console.error(err);
            }
        },
        [email],
    );
    const showZEIP = ['all', 'zeip'];
    const showTreasury = ['all', 'treasury'];
    const numProposals =
        proposals.filter((proposal) => {
            return !proposal.happening && !proposal.upcoming;
        }).length +
            ZEIP_PROPOSALS.filter((zeip) => {
                return zeip.voteEndDate.isBefore(moment.now());
            }).length +
            snapshotProposals?.length || 0;

    let sumOfTotalVotingPowerAverage;
    if (proposals.length && ZEIP_PROPOSALS.length) {
        let sumOfZEIPVotingPower;
        let sumOfTreasuryVotingPower;
        proposals.forEach((proposal) => {
            const tally = {
                no: new BigNumber(proposal.againstVotes.toString()),
                yes: new BigNumber(proposal.forVotes.toString()),
                zeip: proposal.id,
            };
            sumOfTreasuryVotingPower = tally.no.plus(tally.yes);
        });
        ZEIP_PROPOSALS.forEach((zeip) => {
            const tally = tallys && tallys[zeip.zeipId];

            sumOfZEIPVotingPower = tally.no.plus(tally.yes);
        });
        sumOfTotalVotingPowerAverage =
            (Web3Wrapper.toUnitAmount(sumOfTreasuryVotingPower, 18).toNumber() / proposals.length +
                Web3Wrapper.toUnitAmount(sumOfZEIPVotingPower, 18).toNumber() / ZEIP_PROPOSALS.length) /
            2;
    }

    return (
        <StakingPageLayout isHome={false} title="0x Governance">
            <RegisterBanner />
            <DocumentTitle {...documentConstants.VOTE} />
            {/* <Section isTextCentered={true} isPadded={true}> */}
            <GovernanceHero
                title={
                    <div>
                        Make an impact
                        <br />
                        with your ZRX
                    </div>
                }
                numProposals={numProposals}
                averageVotingPower={sumOfTotalVotingPowerAverage}
                titleMobile="Make an impact with your ZRX"
                description={<div>Govern the exchange infrastructure of the Internet</div>}
                figure={<></>}
                actions={
                    <>
                        <Button
                            onClick={() => {
                                document.getElementById('governance-content').scrollIntoView({ behavior: 'smooth' });
                            }}
                            to={''}
                            isInline={true}
                            color={colors.white}
                        >
                            Vote Now
                        </Button>
                        <Button
                            target="_blank"
                            href={
                                'https://0xdao.gitbook.io/0x-dao/ecosystem-value-experiment/0xdao-grant-program-framework-v1'
                            }
                            isInline={true}
                            color={colors.brandLight}
                            isTransparent={true}
                            borderColor={colors.brandLight}
                        >
                            Learn More
                        </Button>
                    </>
                    // tslint:disable-next-line: jsx-curly-spacing
                }
            />
            <NewVoteNotificationSignup>
                <SignupCTA>
                    <img
                        style={{
                            width: '48px',
                            marginRight: '30px',
                        }}
                        src={'/images/mail.png'}
                    />
                    <div>Get notified whenever there's a new vote. (We won't spam)</div>
                </SignupCTA>
                <StyledForm
                    onSubmit={(event) => {
                        setIsSubmitted(true);
                        // tslint:disable-next-line: no-floating-promises
                        onSubmit(event);
                    }}
                >
                    {isSubmitted ? (
                        <SuccessText isSubmitted={isSubmitted}>🎉 Thank you for signing up!</SuccessText>
                    ) : (
                        <InputsWrapper>
                            <EmailWrapper>
                                <Input
                                    color={''}
                                    isSubmitted={isSubmitted}
                                    name="email"
                                    type="email"
                                    label="Email Address"
                                    ref={null}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required={true}
                                />
                            </EmailWrapper>
                        </InputsWrapper>
                    )}

                    <SubmitButton>
                        <SignupArrow
                            isSubmitted={isSubmitted}
                            width="22"
                            height="17"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M13.066 0l-1.068 1.147 6.232 6.557H0v1.592h18.23l-6.232 6.557L13.066 17l8.08-8.5-8.08-8.5z" />
                        </SignupArrow>
                    </SubmitButton>
                </StyledForm>
            </NewVoteNotificationSignup>
            <Wrapper>
                <FlexRow>
                    <FlexRowHeading>Top Forum Discussions:</FlexRowHeading>
                    <Button
                        isWithArrow={true}
                        isAccentColor={true}
                        fontSize="20px"
                        href="https://gov.0x.org/"
                        target="_blank"
                    >
                        Visit Forum
                    </Button>
                </FlexRow>
                <TopPostsRow>
                    {postsLoading ? (
                        <LoaderWrapper>
                            <CircularProgress size={40} thickness={2} color={colors.brandLight} />
                        </LoaderWrapper>
                    ) : (
                        posts &&
                        posts.map((post) => (
                            <ForumThreadCard
                                author={post.author.username}
                                numComments={post.numPosts}
                                title={post.title}
                                url={post.url}
                                key={post.id}
                            />
                        ))
                    )}
                </TopPostsRow>
            </Wrapper>
            {/* <Column>
                    <Heading size="medium" isCentered={true}>
                        Govern 0x Protocol
                    </Heading>
                    <SubtitleContentWrap>
                        <Paragraph size="medium" isCentered={true} isMuted={true} marginBottom="0">
                            Vote on 0x Improvement Proposals (ZEIPs) using ZRX tokens.
                        </Paragraph>
                        <ButtonWrapper>
                            <Button
                                href={constants.URL_VOTE_FAQ}
                                isWithArrow={true}
                                isAccentColor={true}
                                shouldUseAnchorTag={true}
                                target="_blank"
                            >
                                FAQ
                            </Button>
                        </ButtonWrapper>
                    </SubtitleContentWrap>
                </Column> */}
            {/* </Section> */}
            {isLoading ? (
                <LoaderWrapper>
                    <CircularProgress size={40} thickness={2} color={colors.brandLight} />
                </LoaderWrapper>
            ) : (
                <VoteIndexCardWrapper id={'governance-content'}>
                    <Wrapper onClick={() => setIsExpanded((_isExpanded) => !_isExpanded)}>
                        <ToggleRow>
                            <StyledText fontColor={colors.textDarkSecondary}>{getFilterName(filter)}</StyledText>
                            <Arrow isExpanded={isExpanded} />
                            {isExpanded && (
                                <ExpandedMenu>
                                    <MenuItem onClick={() => applyFilter('all')}>
                                        <StyledText>Showing All</StyledText>
                                    </MenuItem>
                                    <MenuItem onClick={() => applyFilter('zeip')}>
                                        <StyledText>ZEIP</StyledText>
                                    </MenuItem>
                                    <MenuItem onClick={() => applyFilter('treasury')}>
                                        <StyledText>Treasury</StyledText>
                                    </MenuItem>
                                </ExpandedMenu>
                            )}
                        </ToggleRow>
                    </Wrapper>
                    {showZEIP.includes(filter) &&
                        ZEIP_PROPOSALS.map((proposal) => {
                            const tally = tallys && tallys[proposal.zeipId];
                            return (
                                <VoteIndexCard
                                    type={VotingCardType.Zeip}
                                    key={proposal.zeipId}
                                    tally={tally}
                                    {...proposal}
                                />
                            );
                        })}
                    {showTreasury.includes(filter) &&
                        proposals.length > 0 &&
                        proposals.map((proposal: TreasuryProposalWithOrder) => {
                            const tally = {
                                no: new BigNumber(proposal.againstVotes.toString()),
                                yes: new BigNumber(proposal.forVotes.toString()),
                                zeip: proposal.id,
                            };
                            return (
                                <VoteIndexCard
                                    type={VotingCardType.Treasury}
                                    key={proposal.id}
                                    tally={tally}
                                    {...proposal}
                                    quorumThreshold={quorumThreshold}
                                />
                            );
                        })}
                    {snapshotProposals &&
                        snapshotProposals.length > 0 &&
                        snapshotProposals.map((proposal: any, index: number) => {
                            return (
                                <VoteIndexCard
                                    type={VotingCardType.Snapshot}
                                    key={proposal.id}
                                    {...proposal}
                                    quorumThreshold={quorumThreshold}
                                />
                            );
                        })}
                </VoteIndexCardWrapper>
            )}
        </StakingPageLayout>
    );
};

const VoteIndexCardWrapper = styled.div`
    margin-bottom: 150px;
    display: flex;
    flex-direction: column;
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    border: none;
    background-color: transparent;
    outline: none;
    margin: auto;
    width: 100%;
    max-width: 1500px;
`;

const Arrow = ({ isExpanded }: { isExpanded?: boolean }) => (
    <svg
        style={{ transform: isExpanded ? 'rotate(180deg)' : null }}
        width="13"
        height="6"
        viewBox="0 0 13 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M1 1L6.5 5L12 1" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ExpandedMenu = styled.div`
    background: ${colors.backgroundLightGrey};
    border: 1px solid rgba(92, 92, 92, 0.15);
    position: absolute;
    z-index: 2;
    display: flex;
    flex-direction: column;
    width: 180px;
    padding: 30px;
    top: 30px;
    @media (max-width: 768px) {
        width: 100%;
        left: 0;
    }
`;

const ToggleRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select: none;
    cursor: pointer;
    position: relative;
    padding-right: 1.65rem;

    * + * {
        margin-left: 8px;
    }
`;

const MenuItem = styled.div`
    cursor: pointer;

    & + & {
        margin-top: 30px;
    }
`;

const StyledText = styled(Text)`
    font-family: 'Formular', monospace;
    font-size: 20px;
    font-feature-settings: 'tnum' on, 'lnum' on;

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

const INPUT_HEIGHT = '60px';

const StyledForm = styled.form`
    display: flex;
    margin-right: 45px;
`;

const InputsWrapper = styled.div`
    display: flex;
`;

const EmailWrapper = styled.div`
    width: 400px;
    margin-right: 0.75rem;
    @media (max-width: 768px) {
        width: 250px;
        margin-bottom: 1rem;
    }
`;
const StyledInput = styled.input<IInputProps>`
    appearance: none;
    background-color: transparent;
    border: 0;
    border-bottom: 1px solid ${({ color }) => color || '#393939'};
    color: ${({ theme }) => theme.textColor};
    height: ${INPUT_HEIGHT};
    font-size: 1.3rem;
    outline: none;
    width: 100%;

    &::placeholder {
        color: #b1b1b1;
    }
`;

const SubmitButton = styled.button`
    height: ${INPUT_HEIGHT};
    background-color: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    padding: 0;
    margin-left: -40px;
`;

const SuccessText = styled.p<IArrowProps>`
    margin-right: 30px;
    font-size: 1rem;
    font-weight: 300;
    line-height: ${INPUT_HEIGHT};
    animation: ${fadeIn} 0.5s ease-in-out;
`;

const SignupArrow = styled.svg<IArrowProps>`
    fill: ${({ color }) => color};
    transform: ${({ isSubmitted }) => isSubmitted && `translateX(44px)`};
    transition: transform 0.25s ease-in-out;
`;

const NewVoteNotificationSignup = styled.div`
    display: flex;
    text-align: center;

    margin: 0 auto;
    margin-bottom: 30px;
    max-width: 1390px;
    justify-content: space-between;
    background-color: #f2f4f3;
    padding: 40px 80px;
    text-align: left;

    @media (max-width: 900px) {
        flex-direction: column;
    }

    @media (max-width: 600px) {
        flex-direction: column;
        padding: 20px 40px;
    }
`;

const SignupCTA = styled.div`
    display: flex;
    align-items: center;
    max-width: 40%;
    @media (max-width: 900px) {
        max-width: 100%;
        margin-bottom: 1rem;
    }
`;

const TopPostsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 20px;
    padding-right: 1.65rem;
    padding-left: 1.65rem;
    margin-bottom: 60px;
`;

const FlexRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    padding-right: 1.65rem;
    padding-left: 1.65rem;
    margin-bottom: 30px;

    * + * {
        margin-left: 8px;
    }
`;

const FlexRowHeading = styled(Heading)`
    flex-grow: 1;
    margin: 0;
    margin-bottom: 0 !important;
`;
// tslint:disable:max-file-line-count
