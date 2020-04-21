import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { generateUniqueId, Jazzicon } from 'ts/components/ui/jazzicon';

import { colors } from 'ts/style/colors';
import { utils } from 'ts/utils/utils';

export interface AccountDetailProps {
    userEthAddress: string;
    userImageSrc?: string;
}

export const AccountDetail: React.StatelessComponent<AccountDetailProps> = ({
    userEthAddress,
    userImageSrc,
}) => {
    const truncatedAddress = utils.getAddressBeginAndEnd(userEthAddress, 7, 5);

    return (
        <Wrap>
            <HorizontalDiv>
                <Avatar>
                    {
                        userImageSrc
                        ? <img src={userImageSrc} />
                        : <Jazzicon seed={generateUniqueId(userEthAddress)} diameter={60} isSquare={true} />
                    }
                </Avatar>
                <ButtonWrapper>
                    <Button
                        href="/zrx/account/activity"
                        isWithArrow={true}
                        isAccentColor={true}
                        shouldUseAnchorTag={true}
                        target="_self"
                    >
                        Show all activity
                    </Button>
                </ButtonWrapper>
            </HorizontalDiv>
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

const HorizontalDiv = styled.div`
    display: flex;
    align-items: flex-end;
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

const ButtonWrapper = styled.div`
    margin-left: 1rem;
    margin-bottom: 22px;
`;
