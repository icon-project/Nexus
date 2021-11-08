import styled from 'styled-components/macro';

import { Link, Header } from 'components/Typography';
import { Helmet } from 'components/Helmet';
import { media } from 'components/Styles/Media';

import notFoundSrc from 'assets/images/not-found.svg';
import backArrow from 'assets/images/blue-left-arrow.svg';

const NotFoundPageWrapper = styled.div`
  text-align: center;
  padding: 80px 0;

  > .not-found-img {
    width: 500px;
    height: 500px;
  }

  > .header-text {
    margin: 10px 0 34px;
  }

  .icon {
    margin-right: 15.5px;
    width: 8px;
    height: 14px;
  }

  ${media.smallDesktop`
    padding: 0;
  `};

  ${media.md`
    > .not-found-img {
      width: 300px;
      height: 300px;
    }
  `};
`;

const NotFoundPage = () => {
  return (
    <NotFoundPageWrapper>
      <Helmet title="Not found" />

      <img className="not-found-img" src={notFoundSrc} />
      <Header className="xs" color="white">
        Something’s missing
      </Header>
      <Link className="md bold" to="/overview">
        <img width="8px" height="14px" className="icon" src={backArrow} />
        Go back to Home
      </Link>
    </NotFoundPageWrapper>
  );
};

export default NotFoundPage;
