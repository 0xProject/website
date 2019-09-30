import * as React from 'react';
import styled from 'styled-components';

import { Definition } from 'ts/components/definition';
import { colors } from 'ts/style/colors';

interface AccountEmptyStakeProps {}

const Wrap = styled.div`
    padding: 60px;
    background-color: ${colors.backgroundLightGrey};

    > div {
        max-width: 780px;
        margin: 0 auto;
    }
`;

const StyledDefinition = styled(Definition)`
    div {
        margin-top: 0;
    }
`;

export const AccountEmptyStake: React.StatelessComponent<AccountEmptyStakeProps> = () => {
    return (
        <Wrap>
            <div>
                <StyledDefinition
                    icon="consistently-ship"
                    title="You haven't staked ZRX"
                    description="Start staking your ZRX and getting interests."
                    iconSize="large"
                    isInlineIcon={true}
                    actions={[
                        {
                            label: 'Start staking',
                            url: '#',
                            shouldUseAnchorTag: true,
                        },
                    ]}
                />
            </div>
        </Wrap>
    );
};
