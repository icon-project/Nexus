import FilterBox from './FilterBox';
import { ALL_ATTRIBUTES } from '../../utils/constants';
import { handleGetFiltersInfo } from '../../utils/app';

export default {
  title: 'Components/FilterBox',
  component: FilterBox,
};

const Template = (args) => <FilterBox {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: 'Group-Users - Filters',
  description: 'Set the conditions to apply to filter the entries',
  filtersData: handleGetFiltersInfo(ALL_ATTRIBUTES),
};
