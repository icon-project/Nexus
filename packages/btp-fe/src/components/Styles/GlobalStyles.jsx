import { createGlobalStyle } from 'styled-components/macro';
import { colors } from './Colors';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0; 
    border: 0;
    box-sizing: border-box;
  }
  *:focus {
    outline: 0;
  }
  html {
    font-size: 62.5%; //10px;
    height: 100%;
  }
  body {
    font: 1.6rem 'Roboto', sans-serif;
  }
  a {
    text-decoration: none;
  }
  ul {
    list-style: none;
  }
  button {
    cursor: pointer;
  }
  p, h3 {
    margin: 0;
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    box-shadow: 0 0 0 50px ${colors.white} inset !important;
  }
`;
