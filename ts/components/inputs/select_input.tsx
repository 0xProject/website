import React from 'react';

import Select, { components } from 'react-select';
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

const Option = (props: any) => {
    const { data } = props;
    return (
        <div {...props}>
            <div>{data.metaData.name}</div>
        </div>
    );
};

interface SelectProps {
    options: any[];
    labelText?: string;
}
export const StakingSimulatorDropdown = ({ options, labelText }: SelectProps) => {
    const [selectedOption, setSelectedOption] = React.useState<{ label: any; value: any }>({
        label: undefined,
        value: undefined,
    });

    const handleChange = (value: any) => console.log(value);

    const selectOptions = options.map(option => {
        return {
            ...option,
            label: option.metaData.name,
        };
    });

    return (
        <Container>
            <Label>{labelText}</Label>
            <SelectComponent
                classNamePrefix="simulator-dropdown"
                value={selectedOption}
                components={{ Option }}
                onChange={(value: any) => handleChange(value)}
                options={selectOptions}
            />
            <ResetText>Reset to Current Values</ResetText>
        </Container>
    );
};
