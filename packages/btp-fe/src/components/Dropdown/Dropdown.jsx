import React from 'react';
import { Dropdown as AntDropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { extraSmallSize } from '../Styles/Media';

const MenuItem = ({ path, title, ...others }) => {
  const logOut = (e) => {
    console.log('click logout');
    others.handleLogout(e);
  };
  return (
    <Menu.Item {...others}>
      {others.effect == 'logUserOut' ? (
        <button onClick={logOut}>{title}</button>
      ) : (
        <Link to={path}>{title}</Link>
      )}
    </Menu.Item>
  );
};

const Dropdown = ({ items, children, fullWidthOnMobile, ...rest }) => {
  const { handleLogout } = rest;
  const menu = () => {
    return (
      <Menu>
        {items.map(({ title, hasDivider, ...rest }) => {
          return (
            <React.Fragment key={title}>
              <MenuItem title={title} {...rest} handleLogout={handleLogout} />
              {hasDivider && <Menu.Divider />}
            </React.Fragment>
          );
        })}
      </Menu>
    );
  };

  return (
    <AntDropdown
      overlay={menu}
      overlayStyle={{ width: extraSmallSize() && fullWidthOnMobile ? '100%' : 'initial' }}
      {...rest}
    >
      {children}
    </AntDropdown>
  );
};

Dropdown.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.node,
      path: PropTypes.string,
      hasDivider: PropTypes.bool,
    }),
  ).isRequired,
  fullWidthOnMobile: PropTypes.bool,
};

Dropdown.defaultProps = {
  fullWidthOnMobile: false,
};

export default Dropdown;
