import { Select } from '../Select';

import FilterIcon from 'assets/images/filter-icon.svg';

const SortSelect = () => {
  const sortOptions = [
    { value: 'abc', label: 'Sort by alphabet' },
    { value: 'highest', label: 'Search by highest amount' },
    { value: 'lowest', label: 'Search by lowest amount' },
  ];
  return <Select options={sortOptions} optionWidth={300} arrowIcon={FilterIcon} showCheck></Select>;
};
export default SortSelect;
