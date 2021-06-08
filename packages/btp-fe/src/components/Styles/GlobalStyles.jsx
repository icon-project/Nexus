import { createGlobalStyle } from 'styled-components/macro';

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
    font-family: 'Poppins', 'Roboto', sans-serif !important;
    height: 100%;
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
  p, h3, ul {
    margin: 0;
  }
`;
