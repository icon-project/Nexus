import { Select } from '../Select';

import FilterIcon from 'assets/images/filter-icon.svg';

const SortSelect = () => {
  const sortOptions = [
    { value: 'abc', label: 'Sort by alphabet' },
    { value: 'highest', label: 'Search by highest amount' },
    { value: 'lowest', label: 'Search by lowest amount' },
  ];
  return <Select options={sortOptions} customeArrow={FilterIcon} showCheck />;
};
export default SortSelect;
