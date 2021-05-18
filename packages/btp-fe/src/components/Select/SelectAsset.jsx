import { useState } from 'react';
import styled from 'styled-components';
import ArrowIconSrc from 'assets/images/arrow-icon.svg';
import BTCIconSrc from 'assets/images/btc-icon.svg';
import BCHIconSrc from 'assets/images/bch-icon.svg';
import ETHIconSrc from 'assets/images/eth-icon.svg';
import { Row } from 'antd';
import { colors } from '../Styles/Colors';

const SelectStyled = styled.div`
  .custom-select-wrapper {
    border: none;
    position: relative;
    width: 235px;
  }
  .custom-select {
  }
  .custom-select__trigger {
    right: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 22px;
    font-size: 16px;
    color: ${colors.grayText};
    height: 24px;
    width: fit-content;
    border-radius: 4px;
    line-height: 24px;
    letter-spacing: 1px;
    cursor: pointer;
    span {
      margin: 0 8px;
    }
  }
  .custom-options {
    position: absolute;
    display: block;
    width: 188px;
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
  }
  .custom-select.open .custom-options {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }
  .custom-option {
    position: relative;
    display: block;
    font-size: 14px;
    font-weight: 300;
    color: ${colors.grayText};
    cursor: pointer;
    transition: all 0.5s;
    background-color: ${colors.grayBG};
    height: 60px;
  }
  .custom-option:hover {
    cursor: pointer;
    background-color: ${colors.grayscaleAccent};
  }
  .custom-option.selected {
    background-color: ${colors.grayscaleAccent};
  }
  .arrow {
    position: relative;
  }
  .icon-option {
    padding: 18px 12px 18px 16px;
  }
  .shortName {
    font-size: 16px;
    padding-top: 8px;
  }
  .fullName {
    font-size: 12px;
    color: #878490;
    line-height: 16px;
  }
`;
const SelectAsset = () => {
  const listNetwork = [
    { value: 'BTC', label: 'Bitcoin', iconUrl: BTCIconSrc },
    { value: 'BCH', label: 'Bitcoin cash', iconUrl: BCHIconSrc },
    { value: 'ETH', label: 'Etherum', iconUrl: ETHIconSrc },
  ];
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedValue, setSelectedValue] = useState(listNetwork[0]);
  const onToggleSelect = () => {
    setIsOpenSelect(!isOpenSelect);
  };
  const onSelectNetwork = (selectedValue) => {
    setSelectedValue(selectedValue);
  };
  return (
    <SelectStyled>
      <div className="custom-select-wrapper" onClick={() => onToggleSelect()}>
        <div className={isOpenSelect ? 'custom-select open' : 'custom-select'}>
          <div className="custom-select__trigger">
            <img src={selectedValue.iconUrl}></img>
            <span>{selectedValue.label}</span>
            <img className="arrow" src={ArrowIconSrc}></img>
          </div>
          <div className="custom-options">
            {listNetwork.map((network, i) => (
              <div
                className={`custom-option ${selectedValue.value === network.value && 'selected'}`}
                key={i}
                onClick={() => {
                  onSelectNetwork(network);
                }}
              >
                <Row>
                  <img className="icon-option" src={network.iconUrl} />
                  <div>
                    <div className="shortName">{network.value}</div>
                    <div className="fullName">{network.label}</div>
                  </div>
                </Row>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SelectStyled>
  );
};
export default SelectAsset;
