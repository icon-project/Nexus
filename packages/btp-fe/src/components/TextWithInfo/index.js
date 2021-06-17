import styled from 'styled-components/macro';
import { SubTitle } from 'components/Typography';
import { Tooltip } from 'components/Tooltip';
import { colors } from 'components/Styles/Colors';
import infoIcon from '../../assets/images/info-icon.svg';

const StyledHeading = styled(SubTitle)`
  color: ${colors.grayScaleSubText};
  display: inline-flex;
  margin-bottom: 10px;
  img {
    padding-left: 8.67px;
  }
  .icon-with-tooltip {
    display: flex;
    align-items: center;
  }
  .icon-with-tooltip:hover .left {
    display: initial;
  }
  .left {
    display: none;
    margin-left: 38.42px;
  }
  .right {
    display: none;
  }
`;

export const TextWithInfo = ({
  children,
  hasInfo = true,
  className,
  tooltip,
  width,
  direction = 'left',
}) => {
  return (
    <StyledHeading className={`small bold ${className}`}>
      {children}
      {hasInfo && (
        <div className="icon-with-tooltip">
          <img src={infoIcon} alt="icon" />
          <Tooltip width={width} direction={direction}>
            {tooltip}
          </Tooltip>
        </div>
      )}
    </StyledHeading>
  );
};
