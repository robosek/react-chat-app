import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import DashboardComponent from "./dashboard/dashboard"
import LoginComponent from "./login/login"
import SignupComponent from "./signup/signup"
import config from "./firebaseConfig";

const firebase = require('firebase')
require('firebase/firestore')

firebase.initializeApp(config)

const routing = (
  <Router>
    <div id="routing-container">
      <Route path="/login" component={ LoginComponent }></Route>
      <Route path="/signup" component={ SignupComponent }></Route>
      <Route path="/dashboard" component={ DashboardComponent }></Route>
    </div>
  </Router>
)

ReactDOM.render(
  //<React.StrictMode>
    routing,
    //<div>asdsa</div>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();