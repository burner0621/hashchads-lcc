import React from 'react';
import { BrowserRouter } from "react-router-dom";
//import Scss
import './assets/scss/themes.scss';

//imoprt Route
import Route from './Routes';
import { useGlobalData, useGlobalChartData } from './contexts/GlobalData'
// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// Fake Backend 
import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);

function App() {
  const globalData = useGlobalData()
  const globalChartData = useGlobalChartData()
  return (
    <React.Fragment>
      {/* {globalData &&
        Object.keys(globalData).length > 0 && */}
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Route />
        </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
