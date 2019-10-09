import * as React from 'react';
import styled from 'styled-components';

import { Button } from 'ts/components/button';
import { Icon } from 'ts/components/icon';

import { colors } from 'ts/style/colors';

interface NumberInputProps {
    placeholder: string;
    topLabel?: string;
    bottomLabels?: BottomLabelProps[];
    onChange?: () => void;
}

interface BottomLabelProps {
    label: string;
    link?: string;
    onClick?: () => void;
}

interface BottomLabelComponentProps {
    item: BottomLabelProps;
}

const Container = styled.div`
    margin-bottom: 30px;
`;

const InputContainer = styled.div`
    border: 1px solid #d9d9d9;
    position: relative;
    height: 70px;
    display: flex;
    align-items: center;
    background-color: ${colors.white};
    &:focus-within {
        border: 1px solid ${colors.brandLight};
    }
`;

const Input = styled.input`
    padding-left: 70px;
    flex: 1;
    align-self: stretch;
    border: 0;
    font-size: 20px;
    font-family: 'Formular', monospace;
    outline: none;
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

const ZrxIcon = styled.div`
    position: absolute;
    left: 15px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    pointer-events: none;

    path {
        fill: ${colors.textDarkSecondary};
    }
`;

const Labels = styled.ol`
    overflow: hidden;
    white-space: nowrap;
    width: 50%;
    text-align: right;
`;

const Label = styled.li`
    font-size: 14px;
    min-width: 70px;
    color: ${colors.textDarkSecondary};
    text-align: center;
    padding: 6px;
    margin-right: 15px;
    display: inline-block;
    border: 1px solid #d5d5d5;
    &:last-child {
        margin-right: 20px;
    }
`;

const TopLabel = styled.span`
    display: block;
    text-align: right;
    width: 100%;
    color: ${colors.textDarkSecondary};
    font-size: 16px;
    line-height: 1.34;
    margin-bottom: 8px;
`;

const BottomLabels = styled.ol`
    text-align: right;
    font-size: 14px;
    line-height: 1.2;
    margin-top: 10px;
    li {
        padding-left: 30px;
        position: relative;
        color: ${colors.textDarkSecondary};
        display: inline-block;
        a {
            color: ${colors.black};
        }
        &:before {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #c4c4c4;
            top: 50%;
            margin-top: -2px;
            left: 13px;
        }
        &:first-child {
            :before {
                display: none;
            }
        }
        &:last-child {
            padding-right: 0;
        }
    }
`;

const BottomLabel: React.FC<BottomLabelComponentProps> = ({ item }) => {
    const { label, link, onClick } = item;

    if (onClick != null) {
        return (
            <li>
                <a href="#" onClick={onClick}>{label}</a>
            </li>
        );
    }

    if (link != null) {
        return (
            <li>
                <a href={link}>{label}</a>
            </li>
        );
    }

    return <li>{label}</li>;
};

export const NumberInput: React.FC<NumberInputProps> = props => {
    const { placeholder, topLabel, bottomLabels, onChange } = props;
    return (
        <Container>
            {topLabel != null && <TopLabel>{topLabel}</TopLabel>}
            <InputContainer>
                <ZrxIcon>
                    <Icon name="logo-mark" size={40} />
                </ZrxIcon>
                <Input type="number" name="stake" placeholder={placeholder} onChange={onChange} />
                <Labels>
                    <Label>25%</Label>
                    <Label>50%</Label>
                    <Label>100%</Label>
                </Labels>
            </InputContainer>
            {bottomLabels != null && bottomLabels.length > 0 && (
                <BottomLabels>
                    {bottomLabels.map((item, index) => {
                        return <BottomLabel item={item} key={index.toString()} />;
                    })}
                </BottomLabels>
            )}
        </Container>
    );
};
