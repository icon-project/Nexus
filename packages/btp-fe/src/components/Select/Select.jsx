import { useState } from 'react';
import styled from 'styled-components';

import ArrowIconSrc from 'assets/images/arrow-icon.svg';
import CheckIconSrc from 'assets/images/white-check-icon.svg';

import { colors } from '../Styles/Colors';
const SelectStyled = styled.div`
  .custom-select-wrapper {
    border: none;
    position: relative;
    width: ${(props) => `${props.width}px` || 'fit-content'};
    padding: 0 16px;
    border-radius: 4px;
    background: ${(props) => (props.isOpen ? '#28262F' : '')};
  }
  .custom-select {
  }
  .custom-select__trigger {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: ${colors.grayText};
    height: 44px;
    line-height: 24px;
    letter-spacing: 0.75px;
    cursor: pointer;
  }
  .custom-options {
    position: absolute;
    display: block;
    width: ${(props) => `${props.optionWidth || 196}px`};
    top: 28px;
    right: 0;
    border: 1px solid #353242;
    box-shadow: 0px 4px 8px rgba(40, 38, 47, 0.8);
    border-radius: 4px;
    border-top: 0;
    transition: all 0.5s;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 2;
    padding-top: 4px;
    background: ${colors.grayBG};
  }
  .custom-select.open .custom-options {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }
  .custom-option {
    position: relative;
    display: block;
    padding: ${(props) => (props.showCheck ? '10px 16px' : '10px 15px')};
    font-size: 14px;
    font-weight: 300;
    color: ${colors.grayText};
    cursor: pointer;
    transition: all 0.5s;
    height: ${(props) => (props.showCheck ? '44px' : '40px')};
    letter-spacing: 0.75px;
    img {
      margin-right: 8px;
      visibility: hidden;
    }
  }
  .custom-option:hover {
    cursor: pointer;
    background-color: ${colors.grayAccent};
  }
  .custom-option.selected {
    background-color: ${colors.grayAccent};
    img {
      visibility: visible;
    }
  }
  .arrow {
    position: relative;
    margin-left: 8.33px;
  }
`;
const Select = ({ options, width, optionWidth, arrowIcon, showCheck }) => {
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0]);
  const onToggleSelect = () => {
    setIsOpenSelect(!isOpenSelect);
  };
  const onSelectOption = (selectedValue) => {
    setSelectedValue(selectedValue);
  };
  return (
    <SelectStyled
      isOpen={isOpenSelect}
      width={width}
      optionWidth={optionWidth}
      showCheck={showCheck}
    >
      <div className="custom-select-wrapper" onClick={() => onToggleSelect()}>
        <div className={isOpenSelect ? 'custom-select open' : 'custom-select'}>
          <div className="custom-select__trigger">
            <span>{selectedValue.label}</span>
            <img className="arrow" src={arrowIcon || ArrowIconSrc} alt="arrow"></img>
          </div>
          <div className="custom-options">
            {options.map((network, i) => (
              <span
                className={`custom-option ${selectedValue.value === network.value && 'selected'}`}
                onClick={() => {
                  onSelectOption(network);
                }}
                key={i}
              >
                {showCheck && <img src={CheckIconSrc} />}
                {network.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SelectStyled>
  );
};
export default Select;
