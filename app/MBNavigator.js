'use strict';

import React from 'react';
import {BackAndroid, Platform, Navigator, StyleSheet} from 'react-native';

import { connect } from 'react-redux';
import { switchTab } from './actions';
import MBTabsView from './tabs/MBTabsView';
import AboutScreen from './tabs/home/AboutScreen';
import SettingsScreen from './tabs/home/SettingsScreen';
import PasswordScreen from './tabs/home/PasswordScreen';
import RideConfirmScreen from './tabs/home/RideConfirmScreen';
import RiderRouteScreen from './tabs/home/RiderRouteScreen';

var MBNavigator = React.createClass({
    _handlers: ([]: Array<() => boolean>),

  componentDidMount: function() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
  },

  componentWillUnmount: function() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
  },
  // Define how the context looks like
  getChildContext() {
    return {
      addBackButtonListener: this.addBackButtonListener,
      removeBackButtonListener: this.removeBackButtonListener,
    };
  },

  addBackButtonListener: function(listener) {
    this._handlers.push(listener);
  },

  removeBackButtonListener: function(listener) {
    this._handlers = this._handlers.filter((handler) => handler !== listener);
  },

  handleBackButton: function() {
    for (let i = this._handlers.length - 1; i >= 0; i--) {
      if (this._handlers[i]()) {
        return true;
      }
    }

    const {navigator} = this.refs;
    if (navigator && navigator.getCurrentRoutes().length > 1) {
      navigator.pop();
      return true;
    }

    if (this.props.tab !== 'home') {
      this.props.dispatch(switchTab('home'));
      return true;
    }
    return false;
  },

  render: function(){
      return(
          <Navigator ref="navigator" style={styles.container} configureScene={(route) => {
              if(Platform.OS === 'android'){
                  if (route.aboutScreen || route.settingsScreen || route.passwordScreen) {
                    return Navigator.SceneConfigs.FloatFromRight;
                  } else {
                      return Navigator.SceneConfigs.FloatFromBottomAndroid;
                  }
              }

              if (route.aboutScreen || route.settingsScreen || route.passwordScreen) {
                return Navigator.SceneConfigs.FloatFromRight;
              } else {
                return Navigator.SceneConfigs.FloatFromBottom;
              }
          }}
          initialRoute={{}}
          renderScene={this.renderScene}
          />
      );
  },
  renderScene: function(route, navigator){
      if(route.aboutScreen){
          return(
              <AboutScreen navigator={navigator} />
          );
      }
      if(route.settingsScreen){
          return(
              <SettingsScreen navigator={navigator} />
          );
      }
      if(route.passwordScreen){
          return(
              <PasswordScreen navigator={navigator} />
          );
      }
      if(route.rideConfirmScreen){
          return(
              <RideConfirmScreen navigator={navigator} { ...route.passProps}/>
          );
      }
      if(route.riderRouteScreen){
        return(
          <RiderRouteScreen navigator={navigator} { ...route.passProps}/>
        );
      }
      return <MBTabsView navigator={navigator} />;
  }
});

// Define types of elements in context
// http://reactkungfu.com/2016/01/react-context-feature-in-practice/
MBNavigator.childContextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

function select(store) {
  return {
    tab: store.navigation.tab,
    isLoggedIn: store.user.isLoggedIn,
  };
}

export default connect(select)(MBNavigator);
