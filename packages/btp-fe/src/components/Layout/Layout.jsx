import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Layout as AtndLayout, Breadcrumb } from 'antd';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { colors } from '../Styles/Colors';

import { mediumSize, media } from '../Styles/Media';

import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import i18n from '../../i18n';

const { Content } = AtndLayout;
const StyledLayout = styled(AtndLayout)`
  min-height: 100vh;
  background-color: ${colors.contentBgColor};
  .ant-layout-content {
    .ant-breadcrumb {
      margin: 16px 24px;
    }
  }
  .main {
    margin: 24px;
    min-height: 360px;
    background-color: ${colors.backgroundColor};
  }
  .ant-menu {
    height: auto;
  }

  ${media.md`
    max-height: 100vh;

  .site-layout {
    .ant-layout-header {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 99;
    }
    .main-wrapper {
      overflow: auto;
    }
  }
  `}
`;

const items = [
  { title: i18n.t('dropdown.my_profile', 'My Profile'), icon: <UserOutlined />, path: '/' },
  {
    title: i18n.t('dropdown.setting', 'Setting'),
    icon: <SettingOutlined />,
    path: '/',
    hasDivider: true,
  },
  { title: i18n.t('dropdown.logout', 'Logout'), icon: <LogoutOutlined />, path: '/' },
];

const Layout = ({ className, children, breadcrumbItems }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(!!mediumSize());

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <StyledLayout className={className}>
      <AtndLayout className="site-layout">
        <Header toggleSidebar={toggleSidebar} items={items} userName="Admin" />
        <div className="main-wrapper">
          <Content>
            {breadcrumbItems.length > 0 && (
              <Breadcrumb>
                {breadcrumbItems.map((item, index) => (
                  <Breadcrumb.Item key={index}>
                    <Link to={item.link}>{item.title}</Link>
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            )}
            <div className="main">{children}</div>
          </Content>
          <Footer className="footer" companyName={t('footer.company_name', 'Lecle Vietnam')} />
        </div>
      </AtndLayout>
    </StyledLayout>
  );
};

Layout.propTypes = {
  breadcrumbItems: PropTypes.array,
  menuList: PropTypes.array.isRequired,
  className: PropTypes.string,
  menuOpenedKey: PropTypes.string,
  menuSelectedKey: PropTypes.string,
};

Layout.defaultProps = {
  breadcrumbItems: [],
  className: '',
};

export default Layout;
