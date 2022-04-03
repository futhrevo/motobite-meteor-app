// @flow

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';
import OneSignal from 'react-native-onesignal';
// import CodePush from 'react-native-code-push';
import { Container, Content, Text, View } from 'native-base';
import Modal from 'react-native-modalbox';
import { connect } from 'react-redux';

import ProgressBar from '../components/loaders/ProgressBar';
import theme from '../themes/base-theme';
import AppNavigator from './AppNavigator';
import MainStackRouter from '../routers/MainStackRouter';
import {
  updateMeteorData,
  updateMeteorServerStatus,
  meteorLoggedout
} from '../../imports/actions/updateMeteorData';
// import { updateOneSignalData } from '../../imports/actions/updateLocalStore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
    height: null
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal1: {
    height: 300
  }
});

class MBApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDownloadingModal: false,
      showInstalling: false,
      downloadProgress: 0
    };
  }
  // componentDidMount() {
  //   OneSignal.configure({});
  //   this.updateReduxStore(this.props);
  //   CodePush.sync({ updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE },
  //     (status) => {
  //       switch (status) {
  //         case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
  //           this.setState({ showDownloadingModal: true });
  //           this._modal.open();
  //           break;
  //         case CodePush.SyncStatus.INSTALLING_UPDATE:
  //           this.setState({ showInstalling: true });
  //           break;
  //         case CodePush.SyncStatus.UPDATE_INSTALLED:
  //           this._modal.close();
  //           this.setState({ showDownloadingModal: false });
  //           break;
  //         default:
  //           break;
  //       }
  //     },
  //     ({ receivedBytes, totalBytes }) => {
  //       this.setState({ downloadProgress: (receivedBytes / totalBytes) * 100 });
  //     }
  //   );
  // }
  componentWillReceiveProps(nextProps) {
    this.updateReduxStore(nextProps);
  }
  updateReduxStore(props) {
    console.log(props);
    if (props.status !== null) {
      if (props.status.connected) {
        if (props.user === null) {
          // this.props.dispatch(meteorLoggedout());
        } else {
          this.props.dispatch(
            updateMeteorData(props.user, props.status, props.loggingIn)
          );
          return;
        }
      }
      this.props.dispatch(
        updateMeteorServerStatus(props.status, props.loggingIn)
      );
    }
  }

  render() {
    if (this.state.showDownloadingModal) {
      return (
        <Container
          theme={theme}
          style={{ backgroundColor: theme.defaultBackgroundColor }}
        >
          <Content style={styles.container}>
            <Modal
              style={[styles.modal, styles.modal1]}
              backdrop={false}
              ref={(c) => {
                this._modal = c;
              }}
              swipeToClose={false}
            >
              <View
                style={{
                  flex: 1,
                  alignSelf: 'stretch',
                  justifyContent: 'center',
                  padding: 20
                }}
              >
                {this.state.showInstalling ? (
                  <Text
                    style={{
                      color: theme.brandPrimary,
                      textAlign: 'center',
                      marginBottom: 15,
                      fontSize: 15
                    }}
                  >
                    Installing update...
                  </Text>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignSelf: 'stretch',
                      justifyContent: 'center',
                      padding: 20
                    }}
                  >
                    <Text
                      style={{
                        color: theme.brandPrimary,
                        textAlign: 'center',
                        marginBottom: 15,
                        fontSize: 15
                      }}
                    >
                      Downloading update...{' '}
                      {`${parseInt(this.state.downloadProgress, 10)} %`}
                    </Text>
                    <ProgressBar
                      color="theme.brandPrimary"
                      progress={parseInt(this.state.downloadProgress, 10)}
                    />
                  </View>
                )}
              </View>
            </Modal>
          </Content>
        </Container>
      );
    }
    return <AppNavigator />;
  }
}

function select(store) {
  return {
    isLoggedIn: store.user.isLoggedIn
  };
}

const App = createContainer(() => {
  const user = Meteor.user();
  if (user) {
    // Meteor.subscribe('theMarkers');
    // Meteor.subscribe('theHouses');
    // Meteor.subscribe('theDrivers');
    // Meteor.subscribe('theDrives');
    // Meteor.subscribe('theLogs');
    // Meteor.subscribe('theRiderReqs');
    // Meteor.subscribe('myOwnGroups');
    // Meteor.subscribe('myGroups');
  }
  return {
    user,
    status: Meteor.status(),
    loggingIn: Meteor.loggingIn()
  };
}, MBApp);

export default connect(select)(App);
