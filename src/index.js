import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// import { injectGlobal } from 'styled-components';

// injectGlobal`
//   body {
//     font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
//   }
// `;


// import registerServiceWorker from './registerServiceWorker';

// Use react-redux's <Provider /> and pass it the store.
ReactDOM.render(<App />,
  document.getElementById('root')
);

// No need for this one yet
// registerServiceWorker();
