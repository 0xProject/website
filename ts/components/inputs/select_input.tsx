import React from 'react';

import Select from 'react-select';
import styled from 'styled-components';
import { colors } from 'ts/style/colors';

const Container = styled.div`
    margin-top: 19px;
`;

const Label = styled.h3`
    margin-bottom: 14px;
`;

const SelectComponent = styled(Select)`
    .simulator-dropdown__control {
        height: 60px;
        border-radius: 0;
        border: 1px solid #898990;
        box-sizing: border-box;
        box-shadow: none !important;

        &--is-focused {
            border-color: ${colors.brandLight} !important;
        }
    }
`;

const ResetText = styled.p`
    color: #00ae99;
    font-size: 17px;
    font-weight: normal;
    line-height: 21px;
    margin-top: 23px;
    cursor: pointer;
    text-align: right;
`;

const StyledOption = styled.div`
    display: flex;
    align-items: center;

    img {
        margin-right: 19px;
    }
`;

const formatOptionLabel = (payload: any) => {
    return (
        <StyledOption>
            <img src={payload.image} width={24} height={24} />
            <div>{payload.label}</div>
        </StyledOption>
    );
};

interface SelectProps {
    options: any[];
    defaultOption?: any;
    labelText?: string;
    onSelected?: (data: SelectOption) => any;
    onReset?: () => void;
}

interface SelectOption {
    label?: string;
    value?: string;
}

export const StakingSimulatorDropdown = ({ options, labelText, onSelected, onReset }: SelectProps) => {
    const [selectedOption, setSelectedOption] = React.useState<SelectOption>();

    const handleChange = (option: SelectOption) => {
        setSelectedOption(option);
        onSelected(option);
    };

    const selectOptions = options.map(option => {
        return {
            label: option.metaData.name,
            value: option.poolId,
            image: option.metaData.logoUrl,
        };
    });

    return (
        <Container>
            <Label>{labelText}</Label>
            <SelectComponent
                classNamePrefix="simulator-dropdown"
                value={selectedOption}
                formatOptionLabel={formatOptionLabel}
                onChange={(value: any) => handleChange(value)}
                options={selectOptions}
            />
            <ResetText onClick={onReset}>Reset to Current Values</ResetText>
        </Container>
    );
};
