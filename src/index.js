import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { init } from '@rematch/core';
import App from './App';
import simulation from './models/simulation';

// import { injectGlobal } from 'styled-components';

// injectGlobal`
//   body {
//     font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
//   }
// `;

const store = init({
  models: {
    simulation
  }
});

// import registerServiceWorker from './registerServiceWorker';

// Use react-redux's <Provider /> and pass it the store.
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// No need for this one yet
// registerServiceWorker();
