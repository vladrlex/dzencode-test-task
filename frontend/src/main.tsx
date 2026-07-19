import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { setupAuthInterceptors } from './store/authInterceptor';
import { verifySession } from './store/authSlice';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import './i18n/i18n';

setupAuthInterceptors(store);
store.dispatch(verifySession());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);