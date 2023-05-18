import React from 'react';
import * as ReactDOMClient from "react-dom/client";
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { configureStore } from "./store";

import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
import GlobalDataContextProvider from './contexts/GlobalData'
import ApplicationContextProvider from './contexts/Application'
import TokenDataContextProvider from './contexts/TokenData'
import PairDataContextProvider from './contexts/PairData'

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
    </>
  )
}

const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
  <LocalStorageContextProvider>
    <ApplicationContextProvider>
      <TokenDataContextProvider>
        <GlobalDataContextProvider>
          <PairDataContextProvider>
            <Provider store={configureStore({})}>
              <Updaters />
              <React.Fragment>
                {/* <BrowserRouter basename={process.env.PUBLIC_URL}> */}
                <App />
                {/* </BrowserRouter> */}
              </React.Fragment>
            </Provider>
          </PairDataContextProvider>
        </GlobalDataContextProvider>
      </TokenDataContextProvider>
    </ApplicationContextProvider>
  </LocalStorageContextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();