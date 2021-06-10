import { gql, request } from 'graphql-request';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useState } from 'react';
import Headroom from 'react-headroom';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import styled, { css } from 'styled-components';

import { MobileNav } from 'ts/components/docs/header/mobile_nav';
import { Link } from 'ts/components/documentation/shared/link';
import { Hamburger } from 'ts/components/hamburger';
import { Logo } from 'ts/components/logo';
import { FlexWrap } from 'ts/components/newLayout';
import { SubMenu } from 'ts/components/staking/header/sub_menu';
import { Proposal, proposals as prodProposals, stagingProposals } from 'ts/pages/governance/data';
import { Dispatcher } from 'ts/redux/dispatcher';
import { State } from 'ts/redux/reducer';
import { ThemeValuesInterface } from 'ts/style/theme';
import { zIndex } from 'ts/style/z_index';
import { AccountState, OnChainProposal, WebsitePaths } from 'ts/types';

import { useWeb3React } from '@web3-react/core';
import { useWallet } from 'ts/hooks/use_wallet';
import { colors } from 'ts/style/colors';
import { GOVERNANCE_THEGRAPH_ENDPOINT } from 'ts/utils/configs';
import { environments } from 'ts/utils/environments';

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

const PROPOSALS = environments.isProduction() ? prodProposals : stagingProposals;
const ZEIP_IDS = Object.keys(PROPOSALS).map((idString) => parseInt(idString, 10));
const ZEIP_PROPOSALS: ProposalWithOrder[] = ZEIP_IDS.map((id) => PROPOSALS[id]).sort(
    (a, b) => b.voteStartDate.unix() - a.voteStartDate.unix(),
);

interface HeaderProps {
    location?: Location;
    isNavToggled?: boolean;
    toggleMobileNav?: () => void;
}

interface NavLinkProps {
    link: NavItems;
    key: string;
}

interface NavItems {
    url?: string;
    id?: string;
    text?: string;
}

const navItems: NavItems[] = [
    {
        id: 'staking',
        text: 'Staking',
        url: WebsitePaths.Staking,
    },
    {
        id: 'governance',
        text: 'Governance',
        url: WebsitePaths.Vote,
    },
    {
        id: 'your-account',
        text: 'Your Account',
        url: WebsitePaths.Account,
    },
];

export const Header: React.FC<HeaderProps> = ({ isNavToggled, toggleMobileNav }) => {
    const { connector, deactivate } = useWeb3React();
    const providerState = useSelector((state: State) => state.providerState);
    const { logoutWallet } = useWallet();

    const dispatch = useDispatch();
    const [dispatcher, setDispatcher] = useState<Dispatcher | undefined>(undefined);
    const [hasLiveOrUpcomingVotes, setHasLiveOrUpcomingVotes] = useState(false);

    const { data } = useQuery('proposals', async () => {
        const { proposals: treasuryProposals } = await request(GOVERNANCE_THEGRAPH_ENDPOINT, FETCH_PROPOSALS);
        return treasuryProposals;
    });

    useEffect(() => {
        setDispatcher(new Dispatcher(dispatch));
    }, [dispatch]);

    const checkHasLiveOrUpcomingVotes = useCallback((treasuryData) => {
        const hasZEIPS = ZEIP_PROPOSALS.filter((zeip) => {
            return zeip.voteEndDate.isSameOrAfter(moment());
        });

        const hasTreasuryProposals = treasuryData.filter((proposal: OnChainProposal) => {
            return moment.unix((proposal.voteEpoch.endTimestamp as unknown) as number).isSameOrAfter(moment());
        });
        setHasLiveOrUpcomingVotes(hasZEIPS.length || hasTreasuryProposals.length);
    }, []);

    useEffect(() => {
        if (data) {
            checkHasLiveOrUpcomingVotes(data);
        }
    }, [data, checkHasLiveOrUpcomingVotes]);

    const onUnpin = useCallback(() => {
        if (isNavToggled) {
            toggleMobileNav();
        }
    }, [isNavToggled, toggleMobileNav]);

    const unpinAndOpenWalletDialog = useCallback(() => {
        onUnpin();
        dispatcher.updateIsConnectWalletDialogOpen(true);
    }, [dispatcher, onUnpin]);

    const onLogoutWallet = useCallback(() => {
        onUnpin();
        logoutWallet(connector, deactivate);
    }, [logoutWallet, onUnpin]);

    const subMenu = (
        <SubMenu
            openConnectWalletDialogCB={unpinAndOpenWalletDialog}
            logoutWalletCB={onLogoutWallet}
            providerState={providerState}
        />
    );

    const isWalletConnected = providerState.account.state === AccountState.Ready;
    return (
        <Headroom
            onUnpin={onUnpin}
            downTolerance={4}
            upTolerance={10}
            wrapperStyle={{ position: 'relative', zIndex: 2 }}
        >
            <StyledHeader isNavToggled={isNavToggled}>
                <HeaderWrap>
                    <LogoWrap>
                        <Link to={WebsitePaths.Home}>
                            <Logo />
                        </Link>
                        <DocsLogoWrap>
                            / <DocsLogoLink to={WebsitePaths.Staking}>ZRX</DocsLogoLink>
                        </DocsLogoWrap>
                    </LogoWrap>

                    <MediaQuery minWidth={1200}>
                        <NavLinks>
                            {navItems.map((link, index) => {
                                return (
                                    <div key={index} style={{ display: 'flex' }}>
                                        <NavItem key={`navlink-${index}`} link={link} />
                                        {link.id === 'governance' && (
                                            <GovernanceActiveIndicator hasProposals={hasLiveOrUpcomingVotes} />
                                        )}
                                    </div>
                                );
                            })}
                        </NavLinks>
                        {subMenu}
                    </MediaQuery>

                    <MediaQuery maxWidth={1199}>
                        <div style={{ position: 'relative' }}>
                            <WalletConnectedIndicator isConnected={isWalletConnected} isNavToggled={isNavToggled} />
                            <Hamburger isOpen={isNavToggled} onClick={toggleMobileNav} />
                        </div>
                        <MobileNav
                            navItems={navItems}
                            isToggled={isNavToggled}
                            toggleMobileNav={toggleMobileNav}
                            hasBackButton={false}
                            hasSearch={false}
                            navHeight={isWalletConnected ? 426 : 365}
                        >
                            {subMenu}
                        </MobileNav>
                    </MediaQuery>
                </HeaderWrap>
            </StyledHeader>
        </Headroom>
    );
};

const BetaTagContainer = styled.div`
    padding: 6px 8px;
    background-color: ${colors.backgroundLightGrey};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    margin-bottom: 4px;
`;

const BetaTag = styled.div`
    font-size: 11px;
    line-height: 13px;
    color: ${colors.backgroundDark};
`;

const NavItem: React.FC<NavLinkProps> = ({ link }) => {
    const linkElement = link.url ? (
        <StyledNavLink to={link.url}>{link.text}</StyledNavLink>
    ) : (
        <StyledAnchor href="#">{link.text}</StyledAnchor>
    );
    return <LinkWrap>{linkElement}</LinkWrap>;
};

interface StyledHeaderProps {
    isNavToggled?: boolean;
}

const StyledHeader = styled.header<StyledHeaderProps>`
    padding: 30px;
    background-color: white;
`;

interface WalletConnectedIndicatorProps {
    isConnected: boolean;
    isNavToggled: boolean;
}

interface GovernanceActiveIndicatorProps {
    hasProposals: boolean;
}

const WalletConnectedIndicator = styled.div<WalletConnectedIndicatorProps>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid #ffffff;
    background-color: ${(props) => (props.isConnected ? '#00AE99' : '#E71D36')};
    transition: opacity 0.25s ease-in;
    opacity: ${(props) => (props.isNavToggled ? 0 : 1)};
    position: absolute;
    top: -7px;
    right: -7px;
    z-index: ${zIndex.header + 1};
`;

const GovernanceActiveIndicator = styled.div<GovernanceActiveIndicatorProps>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #ffffff;
    background-color: #e71d36;
    transition: opacity 0.25s ease-in;
    opacity: ${(props) => (props.hasProposals ? 1 : 0)};
    position: relative;
    right: 1.8rem;
    top: 0.6rem;
    z-index: ${zIndex.header + 1};
`;

const DocsLogoWrap = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    font-size: var(--defaultHeading);
    color: rgba(0, 0, 0, 0.5);
    margin-left: 0.875rem;
    z-index: ${zIndex.header};
`;

const DocsLogoLink = styled(Link)`
    margin-left: 0.625rem;
`;

const LinkWrap = styled.li`
    position: relative;

    a {
        display: block;
    }

    @media (min-width: 1200px) {
        &:hover > div {
            display: block;
            visibility: visible;
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: opacity 0.35s, transform 0.35s, visibility 0s;
        }
    }
`;

const linkStyles = css<{ theme: ThemeValuesInterface }>`
    color: ${({ theme }) => theme.textColor};
    opacity: 0.5;
    transition: opacity 0.35s;
    padding: 15px 0;
    margin: 0 30px;

    &:hover {
        opacity: 1;
    }
`;

const StyledNavLink = styled(Link).attrs({
    activeStyle: { opacity: 1 },
})`
    ${linkStyles as any};
`;

const StyledAnchor = styled.a`
    ${linkStyles};
    cursor: default;
`;

const HeaderWrap = styled(FlexWrap)`
    justify-content: space-between;
    align-items: center;

    @media (max-width: 800px) {
        padding-top: 0;
        display: flex;
        padding-bottom: 0;
    }
    /* HACK(johnrjj) 48px to make same height as the homepage
    Need to find a better way to make header height static across subsites */
    @media (min-width: 1200px) {
        height: 48px;
    }
`;

const NavLinks = styled.ul`
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 800px) {
        display: none;
    }
`;

const LogoWrap = styled.div`
    display: flex;
    align-items: center;
`;
