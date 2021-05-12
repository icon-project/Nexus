import { GENDER, STATUS_FILTER_TYPES, GENERAL_FILTER_TYPES, COLLECTION_TYPES } from './constants';
import { DatePicker } from '../components/DatePicker';
import { Input, Select, InputNumber } from 'antd';

const getGenderLabel = (genderId) => {
  let genderLabel = '';

  switch (genderId) {
    case GENDER.MALE.value:
      genderLabel = GENDER.MALE.label;
      break;
    case GENDER.FEMALE.value:
      genderLabel = GENDER.FEMALE.label;
      break;
    default:
      genderLabel = GENDER.OTHER.label;
      break;
  }

  return genderLabel;
};

const handleGetFiltersInfo = (ALL_ATTRIBUTES) => {
  let filtersObj = Object.entries(ALL_ATTRIBUTES).map((item) => ({
    attribute: item[0],
    type: item[1].type ? item[1].type : 'string',
    values: item[1].type === 'enumeration' ? item[1].enum : [],
    filterTypes: item[1].type === 'enumeration' ? STATUS_FILTER_TYPES : GENERAL_FILTER_TYPES,
  }));
  return filtersObj;
};

const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

const filterObjectByKeyArr = (objItem, keyArr) => {
  if (isEmpty(objItem) || !keyArr || keyArr.length < 1) return {};
  const filtered = Object.keys(objItem)
    .filter((key) => keyArr.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: objItem[key],
      };
    }, {});
  return filtered;
};

const getAttributesForForm = (objItem) => {
  if (isEmpty(objItem)) return {};
  const result = Object.entries(objItem)
    .filter(
      (item) => item[1].via == undefined && item[1].private !== true && item[0] !== 'published_at',
    )
    .reduce((obj, value) => {
      obj[value[0]] = value[1];
      return obj;
    }, {});
  return result;
};

const getDataByAttrName = (value, filtersData) => {
  const item = filtersData.find((item) => item.attribute === value);
  if (!item) return filtersData[0];
  return item;
};

const handleRenderInput = (value, filtersData) => {
  const { type, values } = getDataByAttrName(value, filtersData);
  let inputType;
  switch (true) {
    case COLLECTION_TYPES.TEXT.includes(type):
      inputType = <Input />;
      break;
    case COLLECTION_TYPES.NUMBER.includes(type):
      inputType = <InputNumber />;
      break;
    case COLLECTION_TYPES.DATE.includes(type):
      inputType = <DatePicker />;
      break;
    case COLLECTION_TYPES.BOOLEAN.includes(type):
      inputType = (
        <Select placeholder="Select a option" allowClear>
          <Select.Option key={true} value={true}>
            true
          </Select.Option>
          <Select.Option key={false} value={false}>
            false
          </Select.Option>
        </Select>
      );
      break;
    case COLLECTION_TYPES.PASSWORD.includes(type):
      inputType = <Input.Password />;
      break;
    case COLLECTION_TYPES.ENUMERATION.includes(type):
      inputType = (
        <Select placeholder="Select a option" allowClear>
          {values?.map((item, index) => (
            <Select.Option key={index} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      );
      break;
    default:
      inputType = <Input />;
      break;
  }
  return inputType;
};

export {
  getGenderLabel,
  handleGetFiltersInfo,
  isEmpty,
  filterObjectByKeyArr,
  getAttributesForForm,
  getDataByAttrName,
  handleRenderInput,
};
