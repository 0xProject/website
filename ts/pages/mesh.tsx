import * as React from 'react';

import { Blockquote } from 'ts/components/blockquote';
import { Button } from 'ts/components/button';
import { Section } from 'ts/components/newLayout';
import { DocumentTitle } from 'ts/components/document_title';
import { Hero } from 'ts/components/hero';
import { SiteWrap } from 'ts/components/siteWrap';

import { MeshStats } from 'ts/pages/mesh/mesh_stats';

import { documentConstants } from 'ts/utils/document_meta_constants';

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
            </SiteWrap>
        );
    }
}
