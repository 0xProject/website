import * as React from 'react';
import styled from 'styled-components';

import { Icon } from 'ts/components/icon';

import { colors } from 'ts/style/colors';

interface NumberInputProps {
    heading?: string;
    placeholder: string;
    topLabels?: string[];
    bottomLabels?: BottomLabelProps[];
    isError?: boolean;
    labels?: string[];
    value?: string;
    shouldFocusOnInit?: boolean;
    onChange?: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
    onLabelChange?: (newValue: string) => void;
}

interface BottomLabelProps {
    label: string;
    link?: string;
    onClick?: () => void;
}

interface LabelProps {
    isActive: boolean;
}

interface BottomLabelComponentProps {
    item: BottomLabelProps;
}

interface InputContainerProps {
    isError: boolean;
}

const Container = styled.div`
    margin-bottom: 30px;
`;

const InputContainer = styled.div<InputContainerProps>`
    transition: border 0.3s ease;
    position: relative;
    height: 70px;
    display: flex;
    margin-bottom: 30px;
    align-items: center;
    background-color: ${colors.white};
    border: 1px solid ${props => (props.isError ? colors.orange : '#d9d9d9')};
    &:focus-within {
        border: 1px solid ${props => (props.isError ? colors.orange : colors.brandLight)};
    }
`;

const Input = styled.input`
    padding-left: 70px;
    flex: 1;
    border: 0;
    font-size: 20px;
    font-family: 'Formular', monospace;
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
    display: none;

    @media (min-width: 480px) {
        justify-content: flex-end;
        width: 40%;
        display: flex;
    }
`;

const Label = styled.li<LabelProps>`
    font-size: 14px;
    color: ${props => (props.isActive ? colors.white : colors.textDarkSecondary)};
    background-color: ${props => (props.isActive ? colors.brandLight : colors.white)};
    text-align: center;
    padding: 6px;
    margin-right: 15px;
    border: 1px solid ${props => (props.isActive ? colors.brandLight : '#d5d5d5')};
    cursor: pointer;
    &:last-child {
        margin-right: 20px;
    }
`;

const TopLabels = styled.span`
    display: flex;
    justify-content: space-between;
`;

const TopLabel = styled.span`
    display: block;
    width: 100%;
    color: ${colors.textDarkSecondary};
    font-size: 16px;
    line-height: 1.34;
    margin-bottom: 8px;
    &:last-child {
        text-align: right;
    }
`;

const Heading = styled.h3`
    font-size: 20px;
    line-height: 1.35;
    margin-bottom: 15px;
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
                <a href="#" onClick={onClick}>
                    {label}
                </a>
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
    const {
        placeholder,
        bottomLabels,
        labels,
        onChange,
        onLabelChange,
        topLabels,
        heading,
        isError,
        value,
        shouldFocusOnInit,
    } = props;

    const input = React.useRef(null);

    React.useLayoutEffect(() => {
        if (shouldFocusOnInit) {
            input.current.focus();
        }
    }, []);

    const [selectedOption, setSelectedOption] = React.useState(null);

    const onLabelSelect = (label: string): void => {
        onLabelChange(label);
        setSelectedOption(label);
    };

    return (
        <Container>
            {heading && <Heading>{heading}</Heading>}
            <TopLabels>
                {topLabels != null &&
                    topLabels.length > 0 &&
                    topLabels.map(label => <TopLabel key={label}>{label}</TopLabel>)}
            </TopLabels>
            <InputContainer isError={isError}>
                <ZrxIcon>
                    <Icon name="logo-mark" size={40} />
                </ZrxIcon>
                <Input type="number" name="stake" value={value} placeholder={placeholder} onChange={onChange} ref={input} />
                {labels != null && labels.length > 0 && (
                    <Labels>
                        {labels.map((label, index) => {
                            return (
                                <Label
                                    key={index.toString()}
                                    isActive={selectedOption === label}
                                    onClick={() => onLabelSelect(label)}
                                >
                                    {label}
                                </Label>
                            );
                        })}
                    </Labels>
                )}
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
