import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Layout as AtndLayout, Breadcrumb } from 'antd';
import { Header } from '../Header';
import { colors } from '../Styles/Colors';

import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import i18n from '../../i18n';

const { Content } = AtndLayout;
const StyledLayout = styled(AtndLayout)`
  .ant-layout-content {
    .ant-breadcrumb {
      margin: 16px 24px;
    }
  }
  .main {
    background-color: ${colors.grayDark};
    min-height: calc(100vh - 80px); // minus header height
  }
  .ant-menu {
    height: auto;
  }
`;

const items = [
  { title: i18n.t('dropdown.my_profile', 'My Profile'), icon: <UserOutlined />, path: '/profile' },
  {
    title: i18n.t('dropdown.setting', 'Setting'),
    icon: <SettingOutlined />,
    path: '/setting',
    hasDivider: true,
  },
  {
    title: i18n.t('dropdown.logout', 'Logout'),
    icon: <LogoutOutlined />,
    path: '/',
    effect: 'logUserOut',
  },
];

const Layout = ({ className, children, breadcrumbItems }) => {
  return (
    <StyledLayout className={className}>
      <AtndLayout className="site-layout">
        <Header items={items} userName="Admin" />
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
        </div>
      </AtndLayout>
    </StyledLayout>
  );
};

Layout.propTypes = {
  breadcrumbItems: PropTypes.array,
  className: PropTypes.string,
  menuOpenedKey: PropTypes.string,
  menuSelectedKey: PropTypes.string,
};

Layout.defaultProps = {
  breadcrumbItems: [],
  className: '',
};

export default Layout;
