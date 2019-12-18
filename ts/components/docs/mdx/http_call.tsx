import * as React from 'react';
import styled from 'styled-components';

import { Link } from 'ts/components/documentation/shared/link';

import { Icon } from 'ts/components/icon';
import { Heading, Paragraph } from 'ts/components/text';
import { colors } from 'ts/style/colors';
import { docs } from 'ts/style/docs';

export type HttpVerb = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface HttpCallProps {
    verb?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    path?: string;
}

export const HttpCall: React.FC<HttpCallProps> = props => (
    <HttpCallWrapper>
        <HttpVerb {...props}>{props.verb}</HttpVerb>
        <PathText>{props.path}</PathText>
    </HttpCallWrapper>
);

HttpCall.defaultProps = {
    verb: 'GET',
    path: '/',
};

const verbTextToColor = {
    'GET': colors.brandLight,
    'POST': colors.brandDark,
    'PUT': colors.brandDark,
    'PATCH': colors.brandDark,
    'DELETE': `#AE0000`,
};

const PathText = styled.p`
    font-size: 18px;
    font-family: 'Formular Mono', monospace;
    color: black;
`;

const HttpVerb = styled.div<HttpCallProps>`
    background-color: ${props => verbTextToColor[props.verb]};
    padding: 10px 20px 8px;
    color: white;
    font-size: 18px;
    margin-right: 20px;
    text-transform: uppercase;
    display: flex;
`;

const HttpCallWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 10px;
    margin-bottom: ${docs.marginBottom};
    background-color: ${colors.backgroundLight};
`;
