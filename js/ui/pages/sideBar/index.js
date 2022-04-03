import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Platform } from 'react-native';
import { Container, Content, Text, List, ListItem, View, Left, Icon } from 'native-base';

import { setIndex } from '../../../imports/actions/list';
import navigateTo from '../../../imports/actions/sideBarNav';
import myTheme from '../../themes/base-theme';
import styles from './styles';

const drawerLogo = require('../../../../images/mb.png');

const datas = [
  {
    name: 'Home',
    route: 'home',
    icon: 'ios-map-outline',
    selectedIcon: 'ios-map'
  },
  {
    name: 'Appointments',
    route: 'appointments',
    icon: 'ios-calendar-outline',
    selectedIcon: 'ios-calendar'
  },
  // {
  //   name: 'Safe House',
  //   route: 'home',
  //   icon: 'ios-home-outline',
  //   selectedIcon: 'ios-home'
  // },
  {
    name: 'My Profile',
    route: 'profile',
    icon: 'ios-person-outline',
    selectedIcon: 'ios-person',
  },
  {
    name: 'Contacts',
    route: 'contacts',
    icon: 'ios-contacts-outline',
    selectedIcon: 'ios-contacts',
  },
  // {
  //   name: 'Groups',
  //   route: 'home',
  //   icon: 'ios-globe-outline',
  //   selectedIcon: 'ios-globe',
  // },
  {
    name: 'Chats',
    route: 'chat',
    icon: 'ios-chatboxes-outline',
    selectedIcon: 'ios-chatboxes',
  },
  {
    name: 'Help & Support',
    route: 'help',
    icon: 'ios-heart-outline',
    selectedIcon: 'ios-heart',
  },
  {
    name: 'About',
    route: 'about',
    icon: 'ios-information-circle-outline',
    selectedIcon: 'ios-information-circle',
  },
];
class SideBar extends Component {

  static propTypes = {
    // setIndex: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  render() {
    return (
      <Container>
        <Content style={styles.sidebar} bounces={false}>
          <View style={styles.drawerCover}>
            <Image
              square
              style={styles.drawerImage}
              source={drawerLogo}
            />
          </View>
          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem button noBorder onPress={() => this.navigateTo(data.route)}>
                <Left>
                  <Icon active name={data.icon} style={{ color: '#777', fontSize: 26, width: 30 }} />
                  <Text style={styles.text}>{data.name}</Text>
                </Left>
              </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    setIndex: index => dispatch(setIndex(index)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindAction)(SideBar);
