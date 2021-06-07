import styled from 'styled-components/macro';
import { TextInput } from './TextInput';

import lookupIcon from '../../assets/images/look-up-icon.svg';

const Wrapper = styled.div`
  position: relative;

  & > input {
    padding: 11px 52px 11px 16px;
    width: 373px;
    border-radius: 100px;
  }

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    right: 17.79px;

    width: 17.38px;
    height: 17.38px;
    transform: translateY(-50%);
    background: transparent center / contain no-repeat url('${lookupIcon}');
  }
`;

export const OvalTextInput = () => {
  return (
    <Wrapper>
      <TextInput placeholder="Search auction by name" />
    </Wrapper>
  );
};
