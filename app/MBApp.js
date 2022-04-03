// @flow

import React, { Component } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';
import { connect } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import LoginScreen from './login/LoginScreen';
import MBNavigator from './MBNavigator';
import { serverURL, version } from './env';
import { updateMeteorData, updateOneSignalData } from './actions';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn,
  };
}
console.log('MBApp init .. connecting to Meteor Server');
Meteor.connect(serverURL);// do this only once

class MBApp extends Component {
  constructor(props) {
    super(props);
    this.onIds = this.onIds.bind(this);
  }
  componentWillMount() {
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('registered', this.onRegistered);
    OneSignal.addEventListener('ids', this.onIds);
  }
  componentDidMount() {
    OneSignal.configure({});
    this.updateReduxStore(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.updateReduxStore(nextProps);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('registered', this.onRegistered);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log('Notification received: ', notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onRegistered(notifData) {
    console.log('Device had been registered for push notifications!', notifData);
  }

  onIds(device) {
    console.log('Device info: ', device);
    const oneSignalId = device.userId;
    if (oneSignalId !== null) {
      this.props.dispatch(updateOneSignalData(oneSignalId));
    }
  }
  updateReduxStore(props) {
    if (props.user !== null) {
      this.props.dispatch(updateMeteorData(props.user, props.status, props.loggingIn));
    }
  }
  render() {
    if (!this.props.isLoggedIn) {
      return <LoginScreen />;
    }
    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
        />
        <MBNavigator />
      </View>
    );
  }

}

const MBAppContainer = createContainer(() => {
  console.log('creating container');
  const user = Meteor.user();
  if (user) {
    Meteor.subscribe('theMarkers');
    Meteor.subscribe('theHouses');
    Meteor.subscribe('theDrivers');
    Meteor.subscribe('theDrives');
    Meteor.subscribe('theLogs');
    Meteor.subscribe('theRiderReqs');
    Meteor.subscribe('myOwnGroups');
    Meteor.subscribe('myGroups');
  }
  return {
    user: user,
    status: Meteor.status(),
    loggingIn: Meteor.loggingIn(),
  };
}, MBApp);

export default connect(select)(MBAppContainer);
