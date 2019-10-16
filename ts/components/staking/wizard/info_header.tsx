import styled from 'styled-components';

import { colors } from 'ts/style/colors';

export const InfoHeader = styled.div`
    display: none;

    @media (min-width: 768px) {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }
`;

export const InfoHeaderItem = styled.span`
    font-size: 20px;
    line-height: 1.35;

    &:last-child {
        color: ${colors.textDarkSecondary};
    }
`;