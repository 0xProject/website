import * as React from 'react';

import { FiltersClear } from 'ts/components/docs/sidebar/filters_clear';
import { FiltersGroup } from 'ts/components/docs/sidebar/filters_group';
import { SidebarWrapper } from 'ts/components/docs/sidebar/sidebar_wrapper';

import { ALGOLIA_MAX_NUMBER_FACETS } from '../../../utils/algolia_constants';

interface IFiltersProps {
    filters: IFiltersGroupProps[];
}
interface IFiltersGroupProps {
    attribute: string;
    heading: string;
}

export const Filters: React.FC<IFiltersProps> = ({ filters }) => {
    return (
        <SidebarWrapper>
            {filters.map((filter: IFiltersGroupProps, index: number) => (
                <FiltersGroup key={`filter-${index}`} operator="and" {...filter} limit={ALGOLIA_MAX_NUMBER_FACETS} />
            ))}
            <FiltersClear />
        </SidebarWrapper>
    );
};
