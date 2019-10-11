import * as React from 'react';
import styled from 'styled-components';

import { colors } from 'ts/style/colors';
import { utils } from 'ts/utils/utils';

export interface AccountDetailProps {
    accountAddress: string;
    avatarSrc?: string;
}

export const AccountDetail: React.StatelessComponent<AccountDetailProps> = ({
    accountAddress,
    avatarSrc,
}) => {
    const truncatedAddress = utils.getAddressBeginAndEnd(accountAddress, 7, 3);

    return (
        <Wrap>
            <Avatar>
                <img src={avatarSrc} />
            </Avatar>
            {truncatedAddress}
        </Wrap>
    );
};

const Wrap = styled.div`
    font-size: 34px;
    text-align: left;

    @media (max-width: 768px) {
        width: 100%;
        background-color: ${colors.backgroundLightGrey};
        padding: 20px;
    }
`;

const Avatar = styled.figure`
    width: 60px;
    height: 60px;
    background-color: #fff;
    margin-bottom: 22px;
    border: 1px solid ${colors.border};

    img {
        object-fit: cover;
    }
`;
