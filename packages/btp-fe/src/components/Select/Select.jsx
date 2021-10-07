import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Text } from 'components/Typography';
import { Loader } from 'components/Loader';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

import arrowIcon from 'assets/images/arrow-icon.svg';
import checkedIcon from 'assets/images/white-check-icon.svg';

import { colors } from '../Styles/Colors';

const { brandSecondaryBase, grayLine, grayBG } = colors;

const Wrapper = styled.button`
  display: flex;
  align-items: center;
  position: relative;
  z-index: ${({ isOpenSelect }) => (isOpenSelect ? 100 : 1)};

  cursor: pointer;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: ${({ isOpenSelect }) => (isOpenSelect ? brandSecondaryBase : 'transparent')};

  &:after {
    content: '';
    display: inline-block;
    width: 12px;
    height: 10px;
    background: transparent center / 100% no-repeat url('${arrowIcon}');
    margin-left: 7.67px;

    ${({ customeArrow }) =>
      customeArrow
        ? `
            background-image: url('${customeArrow}');
            width: 17px;
            height: 15px;
          `
        : ''}
  }

  &:hover {
    background-color: ${brandSecondaryBase};
  }

  ul {
    width: max-content;
    position: absolute;
    right: 0;
    top: calc(100% - 10px);

    border: 1px solid ${grayLine};
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(40, 38, 47, 0.8);

    background-color: ${grayBG};
    padding: 4px 0;

    li {
      padding: 10px 16px;
      text-align: left;
      ${({ showCheck }) => (showCheck ? 'padding-left: 40.5px' : '')};

      &:hover {
        background-color: ${brandSecondaryBase};
      }

      &.active {
        background-color: ${brandSecondaryBase};
        display: flex;
        align-items: center;
        padding-left: ${({ showCheck }) => (showCheck ? '10px' : '16px')};

        &:before {
          content: '';
          background: transparent center / contain no-repeat url('${checkedIcon}');
          display: ${({ showCheck }) => (showCheck ? 'inline-block' : 'none')};
          width: 21px;
          height: 15px;
          margin-right: 9.5px;
        }
      }
    }
  }
`;

const Select = ({
  options = [],
  customeArrow,
  showCheck,
  loading,
  onChange = () => {},
  name: fieldName,
  ...ots
}) => {
  const ref = useRef();
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0] || {});

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!loading) {
      setSelectedValue(options[0] || {});
      onChange({
        target: { value: options[0] ? options[0].value : '', name: fieldName, type: 'input' },
      });
    }
  }, [loading, options.length]);

  const onToggleSelect = () => {
    setIsOpenSelect(!isOpenSelect);
  };
  useOnClickOutside(ref, () => setIsOpenSelect(false));

  return (
    <Wrapper
      ref={ref}
      onClick={() => {
        if (!loading && options.length > 0) onToggleSelect();
      }}
      type="button"
      isOpenSelect={isOpenSelect}
      customeArrow={customeArrow}
      showCheck={showCheck}
      {...ots}
    >
      {loading ? (
        <Loader size="25px" borderSize="3px" />
      ) : selectedValue.renderLabel ? (
        selectedValue.renderLabel()
      ) : (
        <Text className="md">{selectedValue.label || selectedValue.name || 'No options'}</Text>
      )}

      {isOpenSelect && (
        <ul>
          {options.map((opt, idx) => {
            const { label, name, value, renderItem } = opt;
            return (
              <li
                key={idx}
                onClick={() => {
                  setSelectedValue(opt);
                  onChange({ target: { value, name: fieldName, type: 'input' } });
                }}
                className={`${
                  (selectedValue.label && selectedValue.label === label) ||
                  (selectedValue.name && selectedValue.name === name)
                    ? 'active'
                    : ''
                }`}
              >
                {renderItem ? renderItem() : <Text className="sm">{label || name}</Text>}
              </li>
            );
          })}
        </ul>
      )}
    </Wrapper>
  );
};
export default Select;
