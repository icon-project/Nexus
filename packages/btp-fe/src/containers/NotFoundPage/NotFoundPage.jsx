import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';

import { Link, Header } from 'components/Typography';
import { media } from 'components/Styles/Media';

import notFoundSrc from 'assets/images/not-found.svg';
import backArrow from 'assets/images/blue-back-arrow.svg';
const NotFoundPageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: block;
  text-align: center;
  .not-found-img {
    padding-top: 80px;
  }
  h3 {
    font-weight: 400;
    color: white;
    margin-bottom: 34px;
    margin-top: 10px;
  }
  a.medium {
    img {
      margin-right: 15.5px;
    }
  }
  ${media.smallDesktop`
  .not-found-img {
    padding-top: 0;
    width: 400px;
    height: 400px;
  }
  `};
  ${media.md`
  .not-found-img {
    width: 300px;
    height: 300px;
  }
  `};
`;

const NotFoundPage = () => {
  return (
    <NotFoundPageWrapper>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <img className="not-found-img" width="500px" height="500px" src={notFoundSrc} />
      <Header className="x-small">Something’s missing</Header>
      <Link className="medium bold" to="/overview">
        <img width="8px" height="14px" src={backArrow} />
        Go back to Home
      </Link>
    </NotFoundPageWrapper>
  );
};

export default NotFoundPage;
