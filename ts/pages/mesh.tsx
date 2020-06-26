import * as React from 'react';

import { DocumentTitle } from 'ts/components/document_title';
import { SiteWrap } from 'ts/components/siteWrap';

import { documentConstants } from 'ts/utils/document_meta_constants';

interface Props {
    location: Location;
}

export class Mesh extends React.Component<Props> {
    public state = {};
    public componentDidMount(): void {}
    public render(): React.ReactNode {
        return (
            <SiteWrap theme="dark">
                <DocumentTitle {...documentConstants.MESH} />
            </SiteWrap>
        );
    }
}
