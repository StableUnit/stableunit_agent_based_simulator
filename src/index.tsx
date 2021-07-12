import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from 'styled-components';

import App from "./App";
// import { injectGlobal } from 'styled-components';
// injectGlobal`
//   body {
//     font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
//   }
// `;
// import registerServiceWorker from './registerServiceWorker';
// Use react-redux's <Provider /> and pass it the store.

const GlobalStyles = createGlobalStyle`
  body {
    background: #f3f7f7;
    color: black;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0 !important;
  }

  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield !important;
  }
`;

ReactDOM.render((
    <>
        <GlobalStyles />
        <App />
    </>
), document.getElementById('root')); // No need for this one yet
// registerServiceWorker();