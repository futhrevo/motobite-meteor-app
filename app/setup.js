// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import MBAppContainer from './MBApp';

class Root extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      store: configureStore(() => this.setState({ isLoading: false })),
    };
  }
  render() {
    if (this.state.isLoading) {
      return null;
    }
    return (
      <Provider store={this.state.store}>
        <MBAppContainer />
      </Provider>
    );
  }
}

global.LOG = (...args) => {
  console.log('/------------------------------\\');
  console.log(...args);
  console.log('\\------------------------------/');
  return args[args.length - 1];
};

export default Root;
