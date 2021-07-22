import styled from 'styled-components/macro';
import { Link, Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

import arrowIcon from 'assets/images/blue-up-arrow.svg';
import { useDispatch } from 'hooks/useRematch';

const Wrapper = styled.div`
  text-align: center;
  margin-top: 22.7px;

  a.small {
    color: ${colors.tertiaryBase};
    margin-top: 14px;
    margin-right: 12px;

    > img {
      width: 12.27px;
      height: 12.27px;
    }
  }
`;

export const SuccessSubmittedTxContent = () => {
  const { setDisplay } = useDispatch(({ modal: { setDisplay } }) => ({
    setDisplay,
  }));
  return (
    <Wrapper>
      <Text className="medium">Your transaction was submitted successfully.</Text>
      <Link
        className="small bold"
        to="/transfer/history"
        center
        onClick={() => {
          setDisplay(false);
        }}
      >
        View on history <img src={arrowIcon} alt="icon" />
      </Link>
    </Wrapper>
  );
};
