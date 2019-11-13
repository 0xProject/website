import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';

import { colors } from 'ts/style/colors';

interface TransactionItemProps {
    sendAmount: string;
    receiveAmount: string;
    marketMakerName: string;
    marketMakerId: string;
    marketMakerIconUrl: string;
    selfId: string;
    selfIconUrl: string;
    isActive: boolean;
    isLeftCaretHidden?: boolean;
    isRightCaretHidden?: boolean;
}

interface CaretProps {
    isLeft?: boolean;
}

interface TransactionRowProps {
    isActive?: boolean;
}

const Container = styled.div`
    max-width: 420px;
    margin: 20px auto 30px auto;
    background-color: ${colors.white};
    display: flex;
`;

const Party = styled.div`
    flex: 0 0 110px;

    @media (min-width: 480px) {
        padding: 0 15px;
    }
`;

const PartySquare = styled.div`
    width: 80px;
    height: 80px;
    border: 1px solid #d9d9d9;
    padding: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 15px auto;
`;

const PartyDescription = styled.div`
    text-align: center;

    h4 {
        font-size: 17px;
        line-height: 1.3;
        margin-bottom: 5px;
    }

    p {
        font-size: 11px;
        line-height: 1.3;
        color: ${colors.textDarkSecondary};
    }
`;

const Transaction = styled.div`
    height: 80px;
    border: 1px solid #d9d9d9;
    padding: 0 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const TransactionRow = styled.div<TransactionRowProps>`
    display: flex;
    font-size: 11px;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 50%;
    position: relative;
    color: ${props => props.isActive ? colors.brandLight : colors.black};

    &:first-child {
        border-bottom: 1px solid #d9d9d9;
    }
`;

const PartyImage = styled.img`
    background-color: ${colors.backgroundLightGrey};
    display: block;
    flex: 0 0 50px;
`;

const Caret = styled(Icon)<CaretProps>`
    position: absolute;
    right: ${props => (props.isLeft ? 'auto' : 0)};
    left: ${props => (props.isLeft ? 0 : 'auto')};
    top: 50%;
    margin-top: -5px;

    path {
        fill: #d9d9d9;
    }
`;

export const TransactionItem: React.FC<TransactionItemProps> = props => {
    const {
        sendAmount,
        receiveAmount,
        marketMakerName,
        marketMakerId,
        selfId,
        selfIconUrl,
        marketMakerIconUrl,
        isActive,
        isLeftCaretHidden,
        isRightCaretHidden,
    } = props;

    return (
        <Container>
            <Party>
                <PartySquare>
                    <PartyImage src={selfIconUrl} alt="Your avatar" />
                </PartySquare>
                <PartyDescription>
                    <h4>You</h4>
                    <p>{selfId}</p>
                </PartyDescription>
            </Party>
            <Transaction>
                <TransactionRow isActive={isActive}>
                    <span>{sendAmount}</span>
                    {!isRightCaretHidden && <Caret name="caret-right" size={10} />}
                </TransactionRow>
                <TransactionRow>
                    <span>{receiveAmount}</span>
                    {!isLeftCaretHidden && <Caret name="caret-left" size={10} isLeft={true} />}
                </TransactionRow>
            </Transaction>
            <Party>
                <PartySquare>
                    <PartyImage src={marketMakerIconUrl} alt={marketMakerName} />
                </PartySquare>
                <PartyDescription>
                    <h4>{marketMakerName}</h4>
                    <p>{marketMakerId}</p>
                </PartyDescription>
            </Party>
        </Container>
    );
};
