import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router/Router';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
  document.getElementById('root')
);


serviceWorker.register();
