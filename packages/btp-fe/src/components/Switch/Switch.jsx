import { Switch as AntdSwitch } from 'antd';
import PropTypes from 'prop-types';

const Switch = ({ onChange, checkedChildren, unCheckedChildren, checked }) => {
  return (
    <AntdSwitch
      onChange={onChange}
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      checked={checked}
    />
  );
};

export { Switch };

Switch.propTypes = {
  //execute when switch is moved
  onChange: PropTypes.func,

  //checkedChildren
  checkedChildren: PropTypes.string,

  //unCheckedChildren
  unCheckedChildren: PropTypes.string,
};
