import React, { Component } from 'react';
import { Image, View, StatusBar } from 'react-native';

const launchscreen = require('../../../../images/rect8053.png');

export default class SplashPage extends Component {

  static propTypes = {
    navigator: React.PropTypes.shape({}).isRequired,
  }

  componentWillMount() {
    const navigator = this.props.navigator;
    setTimeout(() => {
      navigator.replace({
        id: 'home',
      });
    }, 1500);
  }

  render() { // eslint-disable-line class-methods-use-this
    return (
      <View>
        <Image source={launchscreen} style={{ flex: 1, height: null, width: null }} />
        <StatusBar barStyle="light-content" backgroundColor="rgb(83,147,136)" />
      </View>
    );
  }
}
