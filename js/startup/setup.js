import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Meteor from 'react-native-meteor';

import configureStore from './store/configureStore';
import App from '../ui/containers/App';
import { serverURL } from '../imports/api/env';


function setup(): React.Component {
  Meteor.connect(serverURL);// do this only once

  class Root extends Component {

    constructor() {
      super();
      this.state = {
        isLoading: false,
        store: configureStore(() => this.setState({ isLoading: false })),
      };
    }

    render() {
      return (
        <Provider store={this.state.store}>
          <App />
        </Provider>
      );
    }
  }

  return Root;
}

export default setup;
