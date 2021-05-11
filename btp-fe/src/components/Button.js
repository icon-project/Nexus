import { memo } from "react";
import { css } from "@emotion/react";

const buttonStyles = {
  default: css`
    height: 64px;
    border-radius: 4px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;
    cursor: pointer;
  `,
  primary: css`
    background-color: #5465ff;
    border: none;
    color: #ebedff;
  `,
  outline: css`
    color: #99a3ff;
    background-color: transparent;
    border: 1px solid #99a3ff;
    border-radius: 15px;
  `,

  lg: css`
    width: 416px;
  `,
  md: css`
    width: 304px;
  `,
  sm: css`
    height: 48px;
    font-size: 14px;
    line-height: 20px;
    width: 87px;
  `,
};

// <Button position="top" txt={<Icon type=>}>asdfasdfasdf</Button>

const Button = ({ type, customCss, children, onClick, size }) => {
  // top, bottom, middle

  // Object.keys(rest).find(e=> e== "top") && style = buttonStyles.top
  const defSt = buttonStyles.default;
  const sz = buttonStyles[size];
  const style = buttonStyles[type];

  return (
    <button css={[defSt, style, sz, customCss]} onClick={onClick}>
      {children}
    </button>
  );
};

export default memo(Button);
