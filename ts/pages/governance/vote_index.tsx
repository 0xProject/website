import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import { providers, Contract } from 'ethers';
import { useRouteMatch } from 'react-router-dom';
import moment from 'moment';
import CircularProgress from 'material-ui/CircularProgress';

import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { Column, Section } from 'ts/components/newLayout';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading, Paragraph } from 'ts/components/text';
import { Proposal, proposals, stagingProposals } from 'ts/pages/governance/data';
import { VoteIndexCard } from 'ts/pages/governance/vote_index_card';
import { TallyInterface, WebsitePaths, VotingCardType } from 'ts/types';
import { configs } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { environments } from 'ts/utils/environments';
import { ALCHEMY_API_KEY } from 'ts/utils/configs';
import { utils } from 'ts/utils/utils';
import { Switch, Route } from 'react-router';
import { Governance } from './governance';
import { colors } from 'ts/style/colors';
import { Treasury } from './treasury';

type ProposalWithOrder = Proposal & {
    order?: number;
};

const PROPOSALS = environments.isProduction() ? proposals : stagingProposals;
const ZEIP_IDS = Object.keys(PROPOSALS).map(idString => parseInt(idString, 10));
const ZEIP_PROPOSALS: ProposalWithOrder[] = ZEIP_IDS.map(id => PROPOSALS[id]).sort(
    (a, b) => b.voteStartDate.unix() - a.voteStartDate.unix(),
);
const provider = providers.getDefaultProvider(null, {
    alchemy: ALCHEMY_API_KEY,
});
const startingBlockNumber = 9951900;

export interface VoteIndexProps {}

interface ZeipTallyMap {
    [id: number]: TallyInterface;
}

const getOnChainProposals = async () => {
    const abi = [
        'event ProposalCreated (uint256 id, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)',
        'function proposals(uint id) view returns (uint256 id, address proposer, uint256 eta, uint256 startBlock, uint256 endBlock, uint256 forVotes, uint256 againstVotes, bool canceled, bool executed)',
    ];

    const contract = new Contract('0xc0dA01a04C3f3E0be433606045bB7017A7323E38', abi, provider);

    const filter = contract.filters.ProposalCreated();
    const proposalsOnChain = await contract.queryFilter(filter, startingBlockNumber);
    const proposals = [];
    const currentBlock = await utils.getCurrentBlock();
    for (let proposal of proposalsOnChain) {
        const { id, description } = proposal.args;
        const proposalData = await contract.proposals(id);
        const { eta, startBlock, endBlock, canceled, executed, forVotes, againstVotes } = proposalData;
        let blockTimestamp: number = eta.toNumber();
        if (currentBlock < endBlock) {
            blockTimestamp = await utils.getFutureBlockTimestamp(endBlock.toNumber());
        }
        if (startBlock > currentBlock) {
            blockTimestamp = await utils.getFutureBlockTimestamp(startBlock.toNumber());
        }
        if (canceled) {
            const blockEndTime = await provider.getBlock(endBlock.toNumber());
            blockTimestamp = blockEndTime.timestamp;
        }

        proposals.push({
            id: id.toNumber(),
            timestamp: moment(blockTimestamp, 'X'),
            description,
            canceled,
            executed,
            forVotes,
            againstVotes,
            upcoming: startBlock > currentBlock,
            happening: startBlock < currentBlock && currentBlock < endBlock,
        });
    }

    return proposals.reverse();
};

const fetchVoteStatusAsync: (zeipId: number) => Promise<TallyInterface> = async zeipId => {
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

const fetchTallysAsync: () => Promise<ZeipTallyMap> = async () => {
    const tallyResponses = await Promise.all(ZEIP_IDS.map(async zeipId => fetchVoteStatusAsync(zeipId)));
    const tallys: { [key: number]: TallyInterface } = {};
    ZEIP_IDS.forEach((zeipId, i) => (tallys[zeipId] = tallyResponses[i]));
    return tallys;
};

export const TreasuryContext = React.createContext({
    proposals: [],
});

export const VoteIndex: React.FC<VoteIndexProps> = () => {
    const [tallys, setTallys] = React.useState<ZeipTallyMap>(undefined);
    const [proposals, setProposals] = React.useState(undefined);
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        // tslint:disable:no-floating-promises
        (async () => {
            const tallyMap: ZeipTallyMap = await fetchTallysAsync();
            setTallys(tallyMap);
            const proposals = await getOnChainProposals();
            setProposals(proposals);
            setLoading(false);
        })();
    }, []);

    const { path } = useRouteMatch();

    React.useEffect(() => {
        if (!proposals) {
            return;
        }
        let index = 0;

        let zeipLength = ZEIP_PROPOSALS.length - 1;
        let proposalsLength = proposals.length - 1;

        let zeipIndex = 0;
        let proposalIndex = 0;

        while (zeipIndex <= zeipLength && proposalIndex <= proposalsLength) {
            if (ZEIP_PROPOSALS[zeipIndex].voteEndDate.isAfter(proposals[proposalIndex].timestamp)) {
                ZEIP_PROPOSALS[zeipIndex].order = index;
                zeipIndex++;
            } else {
                proposals[proposalIndex].order = index;
                proposalIndex++;
            }
            index++;
        }

        while (zeipIndex <= zeipLength) {
            ZEIP_PROPOSALS[zeipIndex].order = index;
            index++;
            zeipIndex++;
        }
        while (proposalIndex <= proposalsLength) {
            proposals[proposalIndex].order = index;
            proposalIndex++;
            index++;
        }
    }, [proposals]);

    return (
        <Switch>
            <Route exact path={`${WebsitePaths.Vote}/treasury/:proposalId`}>
                <TreasuryContext.Provider value={{ proposals }}>
                    <Treasury />
                </TreasuryContext.Provider>
            </Route>
            <Route path={path}>
                <StakingPageLayout isHome={false} title="0x Governance">
                    <DocumentTitle {...documentConstants.VOTE} />
                    <Section isTextCentered={true} isPadded={true} padding="80px 0 80px">
                        <Column>
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
                        </Column>
                    </Section>
                    {loading ? (
                        <LoaderWrapper>
                            <CircularProgress size={40} thickness={2} color={colors.brandLight} />
                        </LoaderWrapper>
                    ) : (
                        <VoteIndexCardWrapper>
                            {ZEIP_PROPOSALS.map(proposal => {
                                const tally = tallys && tallys[proposal.zeipId];
                                return (
                                    <VoteIndexCard
                                        type={VotingCardType.ZEIP}
                                        key={proposal.zeipId}
                                        tally={tally}
                                        {...proposal}
                                    />
                                );
                            })}
                            {proposals &&
                                proposals.map((proposal: any) => {
                                    const tally = {
                                        no: new BigNumber(proposal.againstVotes.toString()),
                                        yes: new BigNumber(proposal.forVotes.toString()),
                                        zeip: proposal.id,
                                    };
                                    return (
                                        <VoteIndexCard
                                            type={VotingCardType.TREASURY}
                                            key={proposal.id}
                                            tally={tally}
                                            {...proposal}
                                        />
                                    );
                                })}
                        </VoteIndexCardWrapper>
                    )}
                </StakingPageLayout>
            </Route>
        </Switch>
    );
};

const VoteIndexCardWrapper = styled.div`
    margin-bottom: 150px;
    display: flex;
    flex-direction: column;
`;

const SubtitleContentWrap = styled.div`
    max-width: 450px;
    margin: auto;
    & > * {
        display: inline;
    }
`;

const ButtonWrapper = styled.div`
    margin-left: 0.5rem;
`;

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
