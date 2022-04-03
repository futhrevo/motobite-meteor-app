import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Button, Icon, Left, Body, Right, Tabs, Tab } from 'native-base';

import { openDrawer } from '../../../imports/actions/drawer';
import styles from './styles';
import InflateReqs from './InflateReqs';
import InflateDrives from './InflateDrives';
import InflateDrivers from './InflateDrivers';

const {
  popRoute,
} = actions;

class AppointmentsPage extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    popRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  }

  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }

  render() {
    return (
      <Container>
        <Header hasTabs>
          <Left>
            <Button transparent onPress={() => this.popRoute()} rounded>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{'Appointments'}</Title>
          </Body>
          <Right>
            <Button transparent onPress={this.props.openDrawer} rounded>
              <Icon name="ios-menu" />
            </Button>
          </Right>
        </Header>
        <Tabs>
          <Tab heading="Requests">
            <InflateReqs />
          </Tab>
          <Tab heading="Rides">
            <InflateDrives />
          </Tab>
          <Tab heading="Riders">
            <InflateDrivers />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});


export default connect(mapStateToProps, bindAction)(AppointmentsPage);
