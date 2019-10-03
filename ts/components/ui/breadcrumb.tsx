import * as _ from 'lodash';
import * as React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';

export interface Crumb {
    label: string;
    url?: string;
}

export interface BreadcrumbProps {
    crumbs: Crumb[];
}

export const Breadcrumb: React.StatelessComponent<BreadcrumbProps> = ({
    crumbs,
}) => {
    const backUrl = crumbs[crumbs.length - 2].url;

    return (
        <Wrap>
            <ButtonBack to={backUrl}>
                <svg
                    viewBox="0 0 22 17"
                    width="22"
                    height="17"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M13.066 0l-1.068 1.147 6.232 6.557H0v1.592h18.23l-6.232 6.557L13.066 17l8.08-8.5-8.08-8.5z" />
                </svg>
            </ButtonBack>

            <p>
                {_.map(crumbs, crumb => {
                    const Component = crumb.url ? ReactRouterLink : 'span';

                    return (
                        <Component
                            key={crumb.url}
                            to={crumb.url}
                        >
                            {crumb.label}
                        </Component>
                    );
                })}
            </p>
        </Wrap>
    );
};

const Wrap = styled.nav`
    width: calc(100% - 30px);
    max-width: 1500px;
    margin: 0 auto;
    padding: 30px;
    display: flex;
    align-items: center;
    background-color: ${colors.backgroundLightGrey};

    a {
        opacity: 0.6;
    }

    span:last-of-type {
        opacity: 1;
    }

    a + a,
    span:last-of-type {
        &:before {
            content: '/';
            display: inline-block;
            margin: 0 0.4rem;
        }
    }
`;

const ButtonBack = styled(ReactRouterLink)`
    margin-right: 40px;

    svg {
        transform: rotate(180deg);
    }
`;
