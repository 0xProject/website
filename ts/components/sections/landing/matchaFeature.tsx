import * as React from 'react';
import { Section } from 'ts/components/newLayout';
import { Heading, Paragraph } from 'ts/components/text';
import styled from 'styled-components';
import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';

const Wrap = styled.div`
    width: calc(50%);
    min-height: 260px;
    padding: 45px 0;
    display: flex;
    flex-direction: column;

    /* justify-content: center;
    align-items: center; */
    /* text-align: center; */
    /* transition: background-color 0.25s; */
    background-color: ${props => props.theme.darkBgColor};

    @media (max-width: 900px) {
        width: 100%;
        margin-top: 30px;
    }
`;

const MatchaCupCopntainer = styled.div`
    padding: 0;
    align-items: center;
`;

const SectionMatchaFeature = () => {
    return (
        <Section bgColor="dark" isFlex={true} maxWidth="1170px" marginBottom={'15px'} padding={'70px 0 0 0'}>
            <Wrap style={{ padding: '10px 0' }}>
                <Heading asElement={'h3'} size={34}>
                    Matcha <span style={{ color: '#8F8F8F' }}>by 0x</span>
                </Heading>
                <div style={{ maxWidth: 470 }}>
                    <Paragraph fontSize={'22px'} color={'#8F8F8F'}>
                        We built Matcha to show how the 0x API can deliver a world class decentralized trading
                        experience. No signup or KYC required.
                    </Paragraph>
                </div>
                <div style={{ maxWidth: 263 }}>
                    <Button shouldUseAnchorTag={true} target={'_blank'} href={'https://matcha.xyz'}>
                        Trade on Matcha
                    </Button>
                </div>
            </Wrap>

            <Wrap style={{ padding: 0, alignItems: 'center' }}>
                <MatchaCupCopntainer>
                    <Icon name={'matcha-cup'} size={'natural'} style={{ transform: 'translateY(10px)' }} />
                </MatchaCupCopntainer>
            </Wrap>
        </Section>
    );
};

export { SectionMatchaFeature };
