import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FilterOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Row, Col, Typography, Form, Tag } from 'antd';
import DynamicField from './DynamicField';
import { isEmpty } from '../../utils/app';
import { GENERAL_FILTER_TYPES } from '../../utils/constants';
import dayjs from 'dayjs';
import { media } from '../Styles/Media';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const FilterBoxStyle = styled.div`
  .admin-right-col {
    text-align: right;
  }

  .admin-left-col {
    .admin-filter-row {
      text-align: center;
      padding-bottom: 10px;
      .admin-form-item {
        margin-bottom: 10px;
      }
      .admin-minus-btn {
        text-align: center;
        margin-bottom: 10px;
      }
      .admin-plus-btn {
        min-width: 34px;
      }
      .ant-picker {
        width: 100%;
      }
    }

    .show-filter-tags {
      .ant-tag {
        margin: 8px 8px 8px 0;
        padding: 6px 7px 4px;
      }
    }

    .filter-btn {
      margin: 10px 0;
    }
  }

  button {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }

  .ant-select {
    width: 100%;
  }

  .hide {
    display: none;
  }

  .collapse-btn {
    border: none;
    box-shadow: none;
  }

  ${media.lg`
    .admin-left-col {
      .admin-filter-row {
        text-align: left;
        .admin-form-item, .admin-minus-btn {
          margin-bottom: 0;
        }
        .admin-plus-btn {
          text-align: center;
        }
      }
      .show-filter-tags {
        display: inline-block;
      }

      .filter-btn {
        margin-right: 15px;
      }
    }
  `}
`;

const FilterBox = ({ title, description, filtersData, handleSubmit, className = '' }) => {
  const [form] = Form.useForm();
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [valuesForm, setValuesForm] = useState({});
  const [tagList, setTagList] = useState([]);

  const { t } = useTranslation();
  const initialValue = {
    attribute: filtersData[0]?.attribute,
    type: filtersData[0]?.filterTypes[0].value,
    value: '',
  };

  useEffect(() => {
    form.setFieldsValue(valuesForm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valuesForm]);

  const updateFieldsForm = () => {
    // Update values of form when add/remove filter row in DynamicField Component
    setValuesForm(form.getFieldsValue());
  };

  const onFinish = (values) => {
    handleSubmit(values);
    setShowFilterBox(!showFilterBox);
    setTagList(values?.filters);
    setValuesForm(values);
  };

  const handleClearAll = () => {
    setShowFilterBox(false);
    setValuesForm({
      filters: [],
    });
    setTagList([]);
  };

  const onDeleteTag = (e, index) => {
    e.preventDefault();
    const updatedValues = {
      ...valuesForm,
      filters: valuesForm.filters.filter((item, i) => {
        return index !== i;
      }),
    };
    setValuesForm(updatedValues);
    setTagList(updatedValues?.filters);
  };

  return (
    <FilterBoxStyle className={className}>
      <Form
        form={form}
        name="filterBox"
        onFinish={onFinish}
        className={`${showFilterBox ? 'show' : 'hide'}`}
      >
        <Row justify="space-between">
          <Col span={24} lg={16} className="admin-left-col">
            <Title level={3}>{title}</Title>
            <p>{description}</p>
            <DynamicField
              filtersData={filtersData}
              initialValue={initialValue}
              form={form}
              updateFieldsForm={updateFieldsForm}
            />
          </Col>
          <Col span={24} lg={8} className="admin-right-col">
            <Button className="admin-clear-btn" onClick={handleClearAll}>
              {t('filter_box.clear_all', 'Clear all')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isEmpty(valuesForm) || !valuesForm?.filters?.length}
            >
              {t('filter_box.apply', 'Apply')}
            </Button>
          </Col>
        </Row>
      </Form>
      <Row justify="space-between">
        <Col span={24} lg={22} className="admin-left-col">
          <Button
            size="middle"
            onClick={() => setShowFilterBox(!showFilterBox)}
            className="filter-btn"
            type="primary"
          >
            <FilterOutlined />
            {t('filter_box.filters', 'Filters')}
          </Button>
          <div className={`show-filter-tags`}>
            {tagList?.map((item, index) => {
              const inputValue = dayjs(item.value).isValid()
                ? dayjs(item.value).format('DD/MM/YYYY')
                : item.value;
              const inputTypeMapping = GENERAL_FILTER_TYPES.find(
                (typeItem) => typeItem.value === item.type,
              )?.label;
              return (
                <Tag key={index} closable onClose={(e) => onDeleteTag(e, index)} color="blue">
                  {item.attribute} {inputTypeMapping} {inputValue}
                </Tag>
              );
            })}
          </div>
        </Col>
        <Col span={24} lg={2} className="admin-right-col">
          <Button className="collapse-btn" onClick={() => setShowFilterBox(!showFilterBox)}>
            {showFilterBox ? (
              <>
                {t('filter_box.hide', 'Hide')} <UpOutlined />{' '}
              </>
            ) : (
              <DownOutlined />
            )}
          </Button>
        </Col>
      </Row>
    </FilterBoxStyle>
  );
};

FilterBox.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  filtersData: PropTypes.arrayOf(
    PropTypes.shape({
      attribute: PropTypes.string.isRequired,
      filterTypes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        }),
      ).isRequired,
      type: PropTypes.string.isRequired,
      values: PropTypes.array, // ['1', '2', '3'] For enum type with render select option
    }),
  ).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default FilterBox;
