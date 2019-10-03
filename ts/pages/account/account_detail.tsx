import * as React from 'react';
import styled from 'styled-components';

import { truncateStringPortion } from 'ts/constants/utilities';
import { colors } from 'ts/style/colors';

export interface AccountDetailProps {
    accountAddress: string;
    avatarSrc?: string;
}

export interface WrapProps {}
export interface AvatarProps {}

const Wrap = styled.div<WrapProps>`
    font-size: 34px;
    text-align: left;

    @media (max-width: 768px) {
        width: 100%;
        background-color: ${colors.backgroundLightGrey};
        padding: 20px;
    }
`;

const Avatar = styled.figure<AvatarProps>`
    width: 60px;
    height: 60px;
    background-color: #fff;
    margin-bottom: 22px;
    border: 1px solid ${colors.border};

    img {
        object-fit: cover;
    }
`;

export const AccountDetail: React.StatelessComponent<AccountDetailProps> = ({
    accountAddress,
    avatarSrc,
}) => {
    const truncatedAddress = truncateStringPortion(accountAddress, 7, 3);

    return (
        <Wrap>
            <Avatar>
                <img src={avatarSrc} />
            </Avatar>
            {truncatedAddress}
        </Wrap>
    );
};
