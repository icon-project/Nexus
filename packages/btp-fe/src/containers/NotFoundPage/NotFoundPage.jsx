import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';

import { Result, Button } from 'antd';
import { Footer } from 'components/Footer';

const NotFoundPageWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const NotFoundPage = ({ history }) => {
  const { t } = useTranslation();
  return (
    <NotFoundPageWrapper>
      <Helmet>
        <title>{t('not_found_page.page_title', 'Page Not Found')}</title>
      </Helmet>
      <Result
        status="404"
        title={t('not_found_page.title', '404')}
        subTitle={t('not_found_page.description', 'Sorry, the page you visited does not exist.')}
        extra={
          <Button
            onClick={() => {
              history.push(`/`);
            }}
            type="primary"
          >
            {t('not_found_page.back_home', 'Back Home')}
          </Button>
        }
      />
      <Footer className="footer" companyName={t('footer.company_name', '')} />
    </NotFoundPageWrapper>
  );
};

export default NotFoundPage;
