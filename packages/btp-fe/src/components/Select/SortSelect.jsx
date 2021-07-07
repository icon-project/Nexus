import { Select } from '../Select';

import FilterIcon from 'assets/images/filter-icon.svg';

const SortSelect = ({ onChange }) => {
  const sortOptions = [
    { value: { property: 'name', sortBy: 'abc' }, label: 'Sort by alphabet' },
    { value: { property: 'currentBidAmount', sortBy: 'desc' }, label: 'Search by highest amount' },
    { value: { property: 'currentBidAmount', sortBy: 'asc' }, label: 'Search by lowest amount' },
  ];
  return <Select options={sortOptions} customeArrow={FilterIcon} onChange={onChange} showCheck />;
};
export default SortSelect;
