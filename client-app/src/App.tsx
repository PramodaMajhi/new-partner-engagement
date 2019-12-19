import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store';
import { Routes } from './routes'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
const App: React.FC = () => {
  return (
    <MuiThemeProvider>
    <Provider store={store}>
      <div className="topMargin">
      <div className="rectangle">
                <div className="nav">
                  <div className="logo"></div>
                  <div className="user"></div>
                </div>
      </div>
      <Router basename={'/'}>         
            <Routes/>
        </Router>
    </div>
    </Provider>
    </MuiThemeProvider>
  );
}

export default App;
