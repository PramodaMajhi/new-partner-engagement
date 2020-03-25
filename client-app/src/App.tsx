import React, { useEffect }from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store';
import { Routes } from './routes'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { createBrowserHistory } from 'history'
import ReactGA from 'react-ga'


ReactGA.initialize('UA-138450916-4');
const browserHistory = createBrowserHistory()
browserHistory.listen((location, action) => {
  ReactGA.pageview(location.pathname + location.search)
})

const App: React.FC = () => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search)
  }, [])

  return (
    <MuiThemeProvider>
      <Provider store={store}>
        <div className="topMargin">          
          <Router basename={'/'}>
            <Routes />
          </Router>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
