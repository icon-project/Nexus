import styled from 'styled-components/macro';
import { Link, Text } from 'components/Typography';
import { colors } from 'components/Styles/Colors';

import arrowIcon from 'assets/images/blue-up-arrow.svg';
import { useDispatch } from 'hooks/useRematch';

const Wrapper = styled.div`
  text-align: center;
  margin-top: 22.7px;

  a.sm {
    color: ${colors.tertiaryBase};
    margin-top: 14px;
    display: inline-block;

    > img {
      width: 12.27px;
      height: 12.27px;
      margin-left: 12px;
      vertical-align: middle;
    }
  }
`;

export const SuccessSubmittedTxContent = () => {
  const { setDisplay } = useDispatch(({ modal: { setDisplay } }) => ({
    setDisplay,
  }));
  return (
    <Wrapper>
      <Text className="md">
        Nexus is in Beta. Please use at your own risk. Click here for full Terms of Use.
      </Text>
      <Link
        className="sm bold"
        to="/history"
        center
        onClick={() => {
          setDisplay(false);
        }}
      >
        View on history
        <img src={arrowIcon} alt="icon" />
      </Link>
    </Wrapper>
  );
};
