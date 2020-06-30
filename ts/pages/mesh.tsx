import * as React from 'react';

import { Blockquote } from 'ts/components/blockquote';
import { Button } from 'ts/components/button';
import { Column, Section } from 'ts/components/newLayout';
import { Definition } from 'ts/components/definition';
import { DocumentTitle } from 'ts/components/document_title';
import { Hero } from 'ts/components/hero';
import { Heading, Paragraph } from 'ts/components/text';
import { SiteWrap } from 'ts/components/siteWrap';

import { MeshStats } from 'ts/pages/mesh/mesh_stats';

import { documentConstants } from 'ts/utils/document_meta_constants';

const descriptionCasesData = [
    {
        title: 'Decentralized',
        description: 'No listing process, censorship free, globally accessible, and unstoppable',
        icon: 'networkedLiquidity',
    },
    {
        title: 'Limit orders, for more control',
        description: 'Create markets with more granular control over pricing than AMMs like uniswap.',
        icon: 'orderBooks',
    },
    {
        title: 'Supports any asset, including NFTs',
        description: 'Use 0x mesh to host a wide variety of asset types, including non-fungible tokens',
        icon: 'tokens',
    },
];

export class Mesh extends React.Component {
    public render(): React.ReactNode {
        return (
            <SiteWrap theme="dark">
                <DocumentTitle {...documentConstants.MESH} />

                <Hero
                    title="Access token markets, Permissionlessly"
                    description="Use 0x Mesh to access a global peer-to-peer orderbook for tokens"
                    isFullWidth={true}
                    showFigureBottomMobile={true}
                    figure={<MeshStats />}
                    figureMaxWidth="600px"
                    maxWidth="380px"
                    actions={
                        <Button href={'#todo'} isInline={true}>
                            Choose an accesspoint
                        </Button>
                    }
                />

                {/* Prevent double spacing between hero and this section */}
                <Section isWrapped={false} padding="28px 0 120px" paddingMobile="8px 0 40px" overflow="visible">
                    <Blockquote
                        citeUrl="https://twitter.com/VitalikButerin/status/1249421031682510849"
                        citeLabel="Vitalik Buterin, Twitter"
                    >
                        Non-blockchain decentralized message-passing networks (eg. as used by @0xProject @ethstatus) can
                        be a very valuable complement to blockchains, and offer important efficiencies in areas where
                        global consensus is not required
                    </Blockquote>
                </Section>

                <Section bgColor="dark" isFlex={true} maxWidth="1170px">
                    <Column width="50%" maxWidth="550px">
                        <Heading asElement="h2" size="medium">
                            Fully Decentralized, Highly Flexible
                        </Heading>
                        <Paragraph size="medium" isMuted={true} padding={0}>
                            The most flexible solution out there, you can build anything you want, however you want.
                        </Paragraph>
                    </Column>

                    <Column width="46%" maxWidth="490px">
                        {descriptionCasesData.map(item => (
                            <Definition
                                key={item.title}
                                title={item.title}
                                titleSize="small"
                                description={<Description content={item.description} />}
                                icon={item.icon}
                                iconSize={80}
                                isInlineIcon={true}
                                inlineIconSpacing="30px"
                                isWithMargin={true}
                            />
                        ))}
                    </Column>
                </Section>
            </SiteWrap>
        );
    }
}

const Description: React.FC<{ content: string }> = ({ content }) => (
    <Paragraph isMuted={true} padding={0} isNoMargin={true}>
        {content}
    </Paragraph>
);
