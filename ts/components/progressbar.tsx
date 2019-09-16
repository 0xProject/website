import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    max-width: 250px;
    padding: 5px;
`;

interface ProgressbarProps {
  children: React.ReactNode,
}

export const Progressbar: React.FC<ProgressbarProps> = (props: ProgressbarProps) => {
    return (
        <Container>

        </Container>
    );
};
