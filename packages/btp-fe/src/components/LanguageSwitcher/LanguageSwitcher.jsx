import { Menu, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { TranslationOutlined } from '@ant-design/icons';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (value) => {
    i18n.changeLanguage(value.key);
  };

  const menu = (
    <Menu onClick={changeLanguage}>
      <Menu.Item key="en" danger={i18n.language === 'en'}>
        🇺🇸&nbsp;&nbsp;&nbsp;English
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="ko" danger={i18n.language === 'ko'}>
        🇰🇷&nbsp;&nbsp;&nbsp;Korean
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <span className="admin-header-index-action">
        <TranslationOutlined />
      </span>
    </Dropdown>
  );
};
