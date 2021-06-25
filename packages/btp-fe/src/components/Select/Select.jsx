import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Text } from 'components/Typography';
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

const Select = ({ options = [], customeArrow, showCheck, ...ots }) => {
  const ref = useRef();
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0]);

  const onToggleSelect = () => {
    setIsOpenSelect(!isOpenSelect);
  };
  useOnClickOutside(ref, () => setIsOpenSelect(false));

  return (
    <Wrapper
      ref={ref}
      onClick={onToggleSelect}
      type="button"
      isOpenSelect={isOpenSelect}
      customeArrow={customeArrow}
      showCheck={showCheck}
      {...ots}
    >
      {selectedValue.renderLabel ? (
        selectedValue.renderLabel()
      ) : (
        <Text className="medium">{selectedValue.label}</Text>
      )}
      {isOpenSelect && (
        <ul>
          {options.map((opt) => {
            const { label, value, renderItem } = opt;
            return (
              <li
                key={value}
                onClick={() => {
                  setSelectedValue(opt);
                }}
                className={`${selectedValue.value === value ? 'active' : ''}`}
              >
                {renderItem ? renderItem() : <Text className="small">{label}</Text>}
              </li>
            );
          })}
        </ul>
      )}
    </Wrapper>
  );
};
export default Select;
