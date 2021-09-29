import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import { rootReducers }  from "./store/rootReducer";
import logger from "redux-logger";
import { throttleReduxCall } from './components/orderBook/middleware/throttled';

const store = createStore(rootReducers, applyMiddleware(logger, throttleReduxCall));

ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);