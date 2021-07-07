import { Select } from '../Select';

import FilterIcon from 'assets/images/filter-icon.svg';

const SortSelect = ({ onChange }) => {
  const sortOptions = [
    { value: { orderBy: 'name', order: 'desc' }, label: 'Sort by alphabet' },
    { value: { orderBy: 'currentBidAmount', order: 'asc' }, label: 'Search by highest amount' },
    { value: { orderBy: 'currentBidAmount', order: 'desc' }, label: 'Search by lowest amount' },
  ];
  return <Select options={sortOptions} customeArrow={FilterIcon} onChange={onChange} showCheck />;
};
export default SortSelect;
