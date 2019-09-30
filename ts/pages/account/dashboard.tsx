import * as React from 'react';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { Heading } from 'ts/components/text';
import { AccountDetail } from 'ts/pages/account/account_detail';
import { AccountVote } from 'ts/pages/account/account_vote';
import { colors } from 'ts/style/colors';

export interface AccountProps {}

interface WrapperProps {}

interface InnerProps {}
interface FiguresProps {}

const HeaderWrapper = styled.div<WrapperProps>`
    width: 100%;
    max-width: 1500px;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 60px;

    @media (min-width: 768px) {
        padding: 30px;
        text-align: left;
    }
`;

const Inner = styled.div<InnerProps>`
    @media (min-width: 1200px) {
        display: flex;
        justify-content: space-between;
    }

    @media (min-width: 768px) {
        padding: 60px;
        background-color: ${colors.backgroundLightGrey};
    }
`;

const Figures = styled.div<FiguresProps>`
    div {
        background-color: #fff;
        padding: 20px;
        width: 252px;
        height: 94px;
        text-align: left;
    }

    @media (max-width: 1200px) {
        padding-top: 24px;
    }

    @media (min-width: 768px) {
        display: flex;

        div + div {
            margin-left: 12px;
        }
    }
`;

const SectionWrapper = styled.div`
    width: calc(100% - 40px);
    max-width: 1152px;
    margin: 0 auto;
`;

const Grid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

export const Account: React.FC<AccountProps> = props => {
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <HeaderWrapper>
                <Inner>
                    <AccountDetail
                        accountAddress="0x123451234512345"
                        avatarSrc=""
                    />

                    <Figures>
                        {/* Note: replace this with figures component */}
                        <div>Figure</div>
                        <div>Figure</div>
                        <div>Figure</div>
                    </Figures>
                </Inner>
            </HeaderWrapper>

            <SectionWrapper>
                <Heading
                    asElement="h3"
                    fontWeight="400"
                >
                    Your staking pools
                </Heading>
            </SectionWrapper>

            <SectionWrapper>
                <Heading
                    asElement="h3"
                    fontWeight="400"
                >
                    Your voting history
                </Heading>

                <Grid>
                    <AccountVote />
                    <AccountVote />
                    <AccountVote />
                </Grid>
            </SectionWrapper>
        </StakingPageLayout>
    );
};
