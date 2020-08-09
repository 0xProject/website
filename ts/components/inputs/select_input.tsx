import React from 'react';

import SelectComponent from 'react-select';
import styled from 'styled-components';

interface SelectProps {
    options: any[];
}

export const Select = ({ options }: SelectProps) => {
    const [selectedOption, setSelectedOption] = React.useState<{ label: any; value: any }>({
        label: undefined,
        value: undefined,
    });

    const handleChange = (value: any) => console.log(value);

    return <SelectComponent value={selectedOption} onChange={value => handleChange(value)} options={options} />;
};
