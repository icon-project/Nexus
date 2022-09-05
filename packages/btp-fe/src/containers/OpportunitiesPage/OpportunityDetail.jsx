import styled from 'styled-components/macro';
import IconExIcon from 'assets/images/icon-ex.svg';
import StatIcon from 'assets/images/stat-logo.svg';
import { colors } from 'components/Styles';

const StyledDetail = styled.div`
  color: white;
  text-align: left;
  & .title {
    font-size: 24px;
    line-height: 48px;
  }

  & .detail {
    padding: 16px 20px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    & .icon-wrapper {
      position: relative;
      .main-image {
        width: 64px;
      }
      .highlight-float-image {
        position: absolute;
        bottom: 25px;
        right: 0px;
        width: 24px;
        height: 24px;
        border: 2px solid #ffffff;
        border-radius: 65px;
      }
    }

    & .info {
      position: relative;
      & .each-info {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-gap: 24px;
        font-size: 14px;
        line-height: 24px;
        & > h4 {
          text-align: end;
          color: #807f86;
        }
        & > p {
          text-align: left;
          color: #eff1ed;
        }
      }
      & .stat-icon-wrapper {
        position: absolute;
        right: 20px;
        top: -20px;
      }
    }
  }

  & .hrline {
    border-top: 1px solid #353242;
  }

  & .desc {
    margin: 30px 30px 50px 20px;
    > h4 {
      font-weight: 700;
      font-size: 18px;
      line-height: 24px;
      color: #eff1ed;
    }
    > p {
      margin-top: 11px;
      font-size: 14px;
    }
  }

  & .explore-btn {
    height: 54px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 150px);
    border-radius: 4px;
    background: #566afb;
    color: ${colors.grayText};
    margin: auto;
    font-size: 14px;
  }
`;

export const OpportunityDetail = ({
  apy,
  totalAssets,
  type,
  url,
  image,
  about,
  opportunityText,
  title,
}) => {
  console.log({ about, opportunityText });
  return (
    <StyledDetail>
      <div className="detail">
        <div className="icon-wrapper">
          <img src={image} alt={title} className="main-image" />
          <img src={IconExIcon} alt="icon" className="highlight-float-image" />
        </div>
        <div className="info">
          <div className="each-info">
            <h4>APY</h4>
            <p>{apy}</p>
          </div>
          <div className="each-info">
            <h4>total Assets</h4>
            <p>{totalAssets}</p>
          </div>
          <div className="each-info">
            <h4>Type</h4>
            <p>{type}</p>
          </div>
          <div className="each-info">
            <h4>Website</h4>
            <p>{url}</p>
          </div>
          <div className="stat-icon-wrapper">
            <img src={StatIcon} alt="stat logo" />
          </div>
        </div>
      </div>

      <div className="hrline" />
      <div className="desc">
        <h4>Protocol About </h4>
        <p>{about}</p>
      </div>
      <div className="hrline" />
      <div className="desc">
        <h4>Opportunity About </h4>
        <p>{opportunityText}</p>
      </div>
      <a href={url} target="_blank" rel="noreferrer" className="explore-btn">
        <span>Explored</span>
      </a>
    </StyledDetail>
  );
};
