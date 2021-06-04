import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';

import { Result, Button } from 'antd';

const NotFoundPageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NotFoundPage = ({ history }) => {
  return (
    <NotFoundPageWrapper>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            onClick={() => {
              history.push(`/`);
            }}
            type="primary"
          >
            Back Home
          </Button>
        }
      />
    </NotFoundPageWrapper>
  );
};

export default NotFoundPage;
