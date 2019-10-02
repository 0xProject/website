import * as React from 'react';
import styled from 'styled-components';

import { Action, Definition } from 'ts/components/definition';
import { colors } from 'ts/style/colors';

interface AccountEmptyStakeProps {
    icon: string;
    title: string;
    description: string;
    actions?: Action[];
}

const Wrap = styled.div`
    padding: 60px;
    background-color: ${colors.backgroundLightGrey};

    > div {
        max-width: 780px;
        margin: 0 auto;
    }
`;

const StyledDefinition = styled(Definition)`
    p {
        font-size: 22px;
    }

    div {
        margin-top: 0;
    }
`;

export const CallToAction: React.StatelessComponent<AccountEmptyStakeProps> = ({
    icon,
    title,
    description,
    actions,
}) => {
    return (
        <Wrap>
            <div>
                <StyledDefinition
                    icon={icon}
                    title={title}
                    description={description}
                    iconSize="large"
                    isInlineIcon={true}
                    actions={actions}
                />
            </div>
        </Wrap>
    );
};
