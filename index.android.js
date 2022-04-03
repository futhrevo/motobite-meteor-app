/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
// Not recommended
if (__DEV__) {
  window.requestIdleCallback = null
  window.cancelIdleCallback = null
}

import {
  AppRegistry, StatusBar
} from 'react-native';
import setup from './js/startup/setup';

StatusBar.setBarStyle('default');
AppRegistry.registerComponent('mbappNative', setup);
