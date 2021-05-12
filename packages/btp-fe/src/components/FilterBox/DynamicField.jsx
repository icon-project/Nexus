import { useState, useEffect } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Row, Col, Form, Button, Select } from 'antd';
import { handleRenderInput, getDataByAttrName } from 'utils/app';

const DynamicField = (props) => {
  const { filtersData, initialValue, form, updateFieldsForm = () => {} } = props;
  const [mapping, setMapping] = useState();

  useEffect(() => {
    updateFieldsForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapping]);

  const handleSelectAttr = (value, key) => {
    setMapping({ ...mapping, [key]: value });
    const values = form.getFieldsValue();
    const updatedValues = {
      ...values,
      filters: values?.filters.map((filter, index) => {
        if (key === index)
          return {
            type: '=',
            value: '',
            attribute: value,
          };
        return filter;
      }),
    };
    form.setFieldsValue(updatedValues);
  };

  const filterOptions = (value) => {
    return getDataByAttrName(value, filtersData).filterTypes;
  };

  return (
    <Form.List name="filters">
      {(fields, { add, remove }) => {
        return (
          <>
            {!fields.length && (
              <Button
                onClick={() => {
                  setMapping({ 0: initialValue?.attribute });
                  add(initialValue);
                }}
                shape="circle"
                size="small"
              >
                <PlusOutlined />
              </Button>
            )}
            {fields.map((field, index) => (
              <Row
                justify="space-between"
                gutter={[10]}
                className="admin-filter-row"
                align="middle"
                key={field.key}
              >
                <Col span={24} lg={1}>
                  <Button
                    shape="circle"
                    size="small"
                    className="admin-minus-btn"
                    onClick={() => {
                      const mappingData = { ...mapping };
                      remove(index);
                      delete mappingData[field.key];
                      setMapping(mappingData);
                    }}
                  >
                    <MinusOutlined />
                  </Button>
                </Col>
                <Col span={12} lg={7}>
                  <Form.Item name={[index, 'attribute']} className="admin-form-item">
                    <Select onChange={(value) => handleSelectAttr(value, field.key)}>
                      {filtersData?.map((item, index) => (
                        <Select.Option value={item.attribute} key={index}>
                          {item.attribute}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12} lg={7}>
                  <Form.Item name={[index, 'type']} className="admin-form-item">
                    <Select>
                      {filterOptions(mapping[field.key], index).map((item, index) => (
                        <Select.Option value={item.value} key={index}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} lg={7}>
                  <Form.Item name={[index, 'value']} className="admin-form-item">
                    {handleRenderInput(mapping[field.key], filtersData)}
                  </Form.Item>
                </Col>
                <Col span={24} lg={2} className="admin-plus-btn">
                  {fields.length - 1 === index && (
                    <Button
                      shape="circle"
                      size="small"
                      onClick={() => {
                        setMapping({ ...mapping, [+field.key + 1]: initialValue.attribute });
                        add(initialValue);
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
          </>
        );
      }}
    </Form.List>
  );
};

export default DynamicField;
