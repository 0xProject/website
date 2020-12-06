import { BigNumber } from '@0x/utils';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';

import { Button } from 'ts/components/button';
import { DocumentTitle } from 'ts/components/document_title';
import { Column, Section } from 'ts/components/newLayout';
import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading, Paragraph } from 'ts/components/text';
import { Proposal, proposals, stagingProposals } from 'ts/pages/governance/data';
import { VoteIndexCard } from 'ts/pages/governance/vote_index_card';
import { TallyInterface } from 'ts/types';
import { configs } from 'ts/utils/configs';
import { constants } from 'ts/utils/constants';
import { documentConstants } from 'ts/utils/document_meta_constants';
import { environments } from 'ts/utils/environments';
import { Switch, Route } from 'react-router';
import { Governance } from './governance';

const PROPOSALS = environments.isProduction() ? proposals : stagingProposals;
const ZEIP_IDS = Object.keys(PROPOSALS).map((idString) => parseInt(idString, 10));
const ZEIP_PROPOSALS: Proposal[] = ZEIP_IDS.map((id) => PROPOSALS[id]).sort(
    (a, b) => b.voteStartDate.unix() - a.voteStartDate.unix(),
);

export interface VoteIndexProps {}

interface ZeipTallyMap {
    [id: number]: TallyInterface;
}

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

export const VoteIndex: React.FC<VoteIndexProps> = () => {
    const [tallys, setTallys] = React.useState<ZeipTallyMap>(undefined);

    React.useEffect(() => {
        // tslint:disable:no-floating-promises
        (async () => {
            const tallyMap: ZeipTallyMap = await fetchTallysAsync();
            setTallys(tallyMap);
        })();
    }, []);

    const { path } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${path}/:zeip`} component={Governance} />
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
                    <VoteIndexCardWrapper>
                        {ZEIP_PROPOSALS.map(proposal => {
                            const tally = tallys && tallys[proposal.zeipId];
                            console.log(tally);
                            return <VoteIndexCard key={proposal.zeipId} tally={tally} {...proposal} />;
                        })}
                    </VoteIndexCardWrapper>
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
