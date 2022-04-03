// @flow
import React, { Component } from 'react';
import { BackAndroid } from 'react-native';
import { connect } from 'react-redux';
import { Drawer } from 'native-base';
import { actions } from 'react-native-navigation-redux-helpers';
import { StackNavigator } from 'react-navigation';

import { closeDrawer } from '../../imports/actions/drawer';
import Login from '../pages/login';
import Home from '../pages/home';
import BlankPage from '../pages/blankPage';
import SplashPage from '../pages/splashscreen';
import SideBar from '../pages/sideBar';
import AppointmentsPage from '../pages/appointments';
import ProfilePage from '../pages/profile';
import AboutPage from '../pages/about';
import PasswordChange from '../pages/passwordChange';
import ChatPage from '../pages/chat';
import ContactsPage from '../pages/contacts';
import HelpPage from '../pages/help';

const { popRoute } = actions;

class AppNavigator extends Component {
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const routes = this.props.navigation.routes;

      if (
        routes[routes.length - 1].key === 'home' ||
        routes[routes.length - 1].key === 'login'
      ) {
        return false;
      }

      this.props.popRoute(this.props.navigation.key);
      return true;
    });
  }
  componentDidUpdate() {
    if (this.props.drawerState === 'opened') {
      this.openDrawer();
    }

    if (this.props.drawerState === 'closed') {
      this._drawer._root.close();
    }
  }

  popRoute() {
    this.props.popRoute();
  }

  openDrawer() {
    this._drawer._root.open();
  }

  closeDrawer() {
    if (this.props.drawerState === 'opened') {
      this.props.closeDrawer();
    }
  }

  _renderScene(props, isLoggedIn) {
    // eslint-disable-line class-methods-use-this
    let scene = props.scene.route.key;
    if (isLoggedIn) {
      if (props.scene.route.key === 'login') {
        scene = 'home';
      }
    } else {
      if (props.scene.route.key === 'home') {
        scene = 'login';
      }
    }
    switch (scene) {
      case 'splashscreen':
        return <SplashPage />;
      case 'login':
        return <Login />;
      case 'home':
        return <Home />;
      case 'blankPage':
        return <BlankPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'about':
        return <AboutPage />;
      case 'changePassword':
        return <PasswordChange />;
      case 'chat':
        return <ChatPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <Login />;
    }
  }

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref;
        }}
        type="overlay"
        content={<SideBar />}
        tapToClose
        acceptPan={false}
        onClose={() => this.closeDrawer()}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        styles={{
          drawer: {
            shadowColor: '#000000',
            shadowOpacity: 0.8,
            shadowRadius: 3
          }
        }}
        tweenHandler={ratio =>
          //eslint-disable-line
          ({
            drawer: { shadowRadius: ratio < 0.2 ? ratio * 5 * 5 : 5 },
            main: {
              opacity: (2 - ratio) / 2
            }
          })
        }
        negotiatePan
      />
    );
  }
}

AppNavigator.propTypes = {
  drawerState: React.PropTypes.string.isRequired,
  popRoute: React.PropTypes.func.isRequired,
  closeDrawer: React.PropTypes.func.isRequired,
  navigation: React.PropTypes.shape({
    key: React.PropTypes.string,
    routes: React.PropTypes.array
  }).isRequired
};
function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: key => dispatch(popRoute(key))
  };
}

const mapStateToProps = state => ({
  drawerState: state.drawer.drawerState,
  navigation: state.cardNavigation,
  isLoggedIn: state.user.isLoggedIn
});

export default connect(
  mapStateToProps,
  bindAction
)(AppNavigator);
