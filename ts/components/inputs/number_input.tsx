import React from 'react';
import styled from 'styled-components';
import { colors } from 'ts/style/colors';

interface SimulatorNumberInputProps {
    heading?: string;
    token?: string;
    value?: number;
    subText?: string;
    placeholder?: string;
    name?: string;
    onChange?: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
}

const Container = styled.div`
    margin: 31px 0;
`;

const Heading = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
`;

const HeadingText = styled.h3``;

const HeadingSubText = styled.span`
    color: ${colors.darkGrey};
    font-size: 13px;
`;

const InputContainer = styled.div`
    transition: border 0.3s ease;
    position: relative;
    height: 60px;
    display: flex;
    margin-bottom: 30px;
    align-items: center;
    background-color: ${colors.white};
    border: 1px solid #d9d9d9;
    &:focus-within {
        border: 1px solid ${colors.brandLight};
    }
`;

const Input = styled.input`
    padding-left: 24px;
    padding-right: 30px;
    margin-left: 1px;
    flex: 1;
    border: 0;
    font-size: 20px;
    font-family: 'Formular', monospace;
    color: ${colors.black};
    outline: none;
    width: 60%;
    &::placeholder {
        color: ${colors.textDarkSecondary};
        font-family: 'Formular', monospace;
    }
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const Ticker = styled.div`
    padding-right: 15px;
`;

export const SimulatorNumberInput: React.FC<SimulatorNumberInputProps> = ({
    heading,
    token,
    value,
    subText,
    placeholder,
    name,
    onChange,
}) => {
    const input = React.useRef(null);

    return (
        <Container>
            <Heading>
                <HeadingText>{heading}</HeadingText>
                <HeadingSubText>{subText}</HeadingSubText>
            </Heading>
            <InputContainer>
                <Input
                    type="number"
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    ref={input}
                />
                <Ticker>{token}</Ticker>
            </InputContainer>
        </Container>
    );
};
