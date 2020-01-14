import styled from 'styled-components';

import { colors } from 'ts/style/colors';

export const Inner = styled.div`
    background-color: ${colors.white};

    @media (min-width: 768px) {
        border: 1px solid #e3e3e3;
        padding: 30px;
    }
`;
