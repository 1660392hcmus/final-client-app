// import React from "react";

// import { Container } from "reactstrap";
// import Home from "./components/Home";

// class App extends React.Component {
//   render() {
//     return <Home />;
//   }
// }

// export default App;

// @ts-nocheck
import React, { Component } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './store/actions';

import theme from './theme';
import Alert from './components/Alert';
import { pageCursors } from './utils';
import Routes from './Routes';

import './assets/scss/index.scss';
import 'typeface-montserrat';
import { CssBaseline } from '@material-ui/core';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
    pageCursors();
  }
  render() {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Alert />
          <Routes />
          <div className="cursor" id="cursor" />
          <div className="cursor2" id="cursor2" />
          <div className="cursor3" id="cursor3" />
        </ThemeProvider>
      </Provider>
    );
  }
}
export default App;
