import * as React from 'react';

import { Button } from 'ts/components/button';
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
            </SiteWrap>
        );
    }
}
