import * as React from 'react';
import styled from 'styled-components';
import { Icon } from 'ts/components/icon';
import { Section } from 'ts/components/newLayout';

const ResponsiveColumnSection = styled(Section)`
    justify-content: center;
    @media (min-width: 768px) {
        justify-content: center;
    }
`;

const LogosUsingZeroExApiContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
`;

const LogoIconContainer = styled.div`
    padding: 27px;
`;

const LogoExternalLink = styled.a``;

const LogoSectionColumnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-self: center;
    justify-content: center;
`;

const SectionLandingLogos = () => {
    return (
        <ResponsiveColumnSection
            justifyContent={'center'}
            bgColor="black"
            isFlex={true}
            maxWidth="1386px"
            padding={'0px 0px 66px 0px'}
            marginBottom={'20px'}
            paddingMobile={'64px 0 40px 0'}
        >
            <div>
                <LogoSectionColumnContainer>
                    <LogosUsingZeroExApiContainer>
                        <LogoExternalLink href={'https://matcha.xyz'} target="_blank" rel="noopener">
                            <LogoIconContainer>
                                <Icon name={'integrators/matcha'} size={'natural'} />
                            </LogoIconContainer>
                        </LogoExternalLink>
                        <LogoExternalLink href={'https://metamask.io/'} target="_blank" rel="noopener">
                            <LogoIconContainer>
                                <Icon name={'integrators/metamask'} size={'natural'} />
                            </LogoIconContainer>
                        </LogoExternalLink>
                        <LogoExternalLink href={'https://zerion.io'} target="_blank" rel="noopener">
                            <LogoIconContainer>
                                <Icon name={'integrators/zerion'} size={'natural'} />
                            </LogoIconContainer>
                        </LogoExternalLink>
                        <LogoExternalLink href={'https://defisaver.com'} target="_blank" rel="noopener">
                            <LogoIconContainer>
                                <Icon name={'integrators/defi-saver'} size={'natural'} />
                            </LogoIconContainer>
                        </LogoExternalLink>
                        <LogoExternalLink href={'https://rari.capital'} target="_blank" rel="noopener">
                            <LogoIconContainer>
                                <Icon name={'integrators/rari'} size={'natural'} />
                            </LogoIconContainer>
                        </LogoExternalLink>
                        <LogoExternalLink href={'https://prysm.xyz'} target="_blank" rel="noopener">
                            <LogoIconContainer>
                                <Icon name={'integrators/prysm'} size={'natural'} />
                            </LogoIconContainer>
                        </LogoExternalLink>
                    </LogosUsingZeroExApiContainer>
                </LogoSectionColumnContainer>
            </div>
        </ResponsiveColumnSection>
    );
};

export { SectionLandingLogos };
