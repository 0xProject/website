import * as React from 'react';
import styled from 'styled-components';

import { StakingPageLayout } from 'ts/components/staking/layout/staking_page_layout';
import { AccountDetail } from 'ts/components/ui/account_detail';
import { colors } from 'ts/style/colors';

export interface AccountProps {}

interface WrapperProps {}

interface InnerProps {}
interface FiguresProps {}

const Wrapper = styled.div<WrapperProps>`
    width: 100%;
    text-align: center;
    @media (min-width: 768px) {
        padding: 30px;
        text-align: left;
    }
`;

const Inner = styled.div<InnerProps>`
    background-color: ${colors.backgroundLightGrey};
    display: flex;
    justify-content: space-between;

    @media (min-width: 768px) {
        padding: 60px;
    }
`;

const Figures = styled.div<FiguresProps>`
    div {
        background-color: #fff;
        padding: 15px;
        width: 252px;
        height: 94px;
    }

    @media (min-width: 768px) {
        display: flex;

        div + div {
            margin-left: 12px;
        }
    }
`;

export const Account: React.FC<AccountProps> = props => {
    return (
        <StakingPageLayout isHome={true} title="0x Staking">
            <Wrapper>
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
            </Wrapper>
        </StakingPageLayout>
    );
};
