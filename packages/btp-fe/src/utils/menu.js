import { UserOutlined, UserAddOutlined } from '@ant-design/icons';
import { ROUTES } from './routeConstants';

export const menuList = [
  {
    key: 'Users',
    title: 'Users',
    icon: <UserOutlined />,
    subMenu: [
      {
        title: 'User management',
        key: 'UserManagement',
        icon: <UserOutlined />,
        path: ROUTES.USER_LIST,
      },
      {
        title: 'Create a new user',
        key: 'UserCreate',
        icon: <UserAddOutlined />,
        path: ROUTES.CREATE_NEW_USER,
      },
    ],
  },
];
