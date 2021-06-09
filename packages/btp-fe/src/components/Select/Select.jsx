import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Text } from 'components/Typography';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

import arrowIcon from 'assets/images/arrow-icon.svg';
// import CheckIconSrc from 'assets/images/white-check-icon.svg';

import { colors } from '../Styles/Colors';

const Wrapper = styled.button`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 100;

  cursor: pointer;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: transparent;

  &:after {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background: transparent center / contain no-repeat url('${arrowIcon}');
    margin-left: 7.67px;
  }

  &:hover {
    background-color: ${colors.brandSecondaryBase};
  }

  ul {
    width: max-content;
    position: absolute;
    right: 0;
    top: calc(100% - 10px);

    border: 1px solid ${colors.grayLine};
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(40, 38, 47, 0.8);

    background-color: ${colors.grayBG};
    padding: 4px 0;

    li {
      padding: 10px 16px;
      text-align: left;

      &:hover {
        background-color: ${colors.brandSecondaryBase};
      }
    }
  }
`;

const Select = ({ options = [] }) => {
  const ref = useRef();
  const [isOpenSelect, setIsOpenSelect] = useState(false);
  const [selectedValue, setSelectedValue] = useState(options[0]);
  const onToggleSelect = () => {
    setIsOpenSelect(!isOpenSelect);
  };

  useOnClickOutside(ref, () => setIsOpenSelect(false));
  return (
    <Wrapper ref={ref} onClick={onToggleSelect} type="button">
      <Text className="medium">{selectedValue.label}</Text>
      {isOpenSelect && (
        <ul>
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                setSelectedValue(opt);
              }}
            >
              <Text className="small">{opt.label}</Text>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
};
export default Select;
