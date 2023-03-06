import * as React from 'react';
import styled from 'styled-components';

interface ListItemProps {
    children: string | React.ReactNode;
    muted?: boolean;
    id?: string;
}

interface OrderedListProps {
    marginBottom?: string;
    listStyle?: React.HTMLProps<HTMLOListElement>['type'];
}
export interface UnorderedListProps {
    marginBottom?: string;
}

export const UnorderedList = styled.ul<UnorderedListProps>`
    list-style-type: disc;
    padding-left: 20px;
    margin-bottom: ${(props) => props.marginBottom};
`;

export const OrderedList = styled.ol<OrderedListProps>`
    list-style-type: ${({ listStyle = 'decimal' }) => listStyle};
    padding-left: 20px;
    margin-bottom: ${(props) => props.marginBottom};
`;

const Li = styled.li<ListItemProps>`
    padding: 0 0 0.8rem 0.2rem;
    position: relative;
    line-height: 1.4rem;
    text-align: left;
    font-weight: 300;
    opacity: ${(props) => (props.muted === false ? 1 : 0.5)};
    @media (max-width: 768px) {
        font-size: 15px;
    }
`;

export const ListItem = ({ children, id, ...props }: ListItemProps) => (
    <Li id={id} {...props}>
        {children}
    </Li>
);
