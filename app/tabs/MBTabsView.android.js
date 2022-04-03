// @flow
'use strict';

import React, {Component} from 'react';
import {Image, Navigator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import MenuItem from './MenuItem';
import {NormalText} from '../common/MBText';
import MBColors from '../common/MBColors';
import { switchTab } from '../actions';
import MBDrawerLayout from '../common/MBDrawerLayout';
import type {Tab} from '../reducers/navigation';
import HomeTab from './home/HomeTab';
import MBAppointmentsView from './appointments/MBAppointmentsView';
import MBChatsView from './chats/MBChatsView';
import MBContactsView from './contacts/MBContactsView';
import MBGroupsView from './groups/MBGroupsView';
import MBHelpView from './help/MBHelpView';
import MBMyProfileView from './myProfile/MBMyProfileView';
import MBSafeHouseView from './safeHouse/MBSafeHouseView';
class MBTabsView extends Component{
    props: {
        tab: Tab;
        onTabSelect: (tab: Tab) => void;
        navigator: Navigator;
        email: string;
        profilePic: string;

      };

      constructor(props) {
          super(props);

          this.renderNavigationView = this.renderNavigationView.bind(this);
          this.openDrawer = this.openDrawer.bind(this);
          this.state = {
              email: " ",
              profilePic: " ",
           };
      }
      getChildContext() {
        return {
          openDrawer: this.openDrawer,
        };
      }
      componentWillMount(){
          this.setState({email: this.props.email});
          this.setState({profilePic: this.props.profilePic});
      }
      componentWillReceiveProps(nextProps){
          console.log("update email and profilepic");
          this.setState({
              email: nextProps.email,
              profilePic: nextProps.profilePic,
          })
      }
      openDrawer() {
          this.refs.drawer.openDrawer();
        }
    onTabSelect(tab: Tab) {
        if (this.props.tab !== tab) {
          this.props.onTabSelect(tab);
        }
        this.refs.drawer.closeDrawer();
      }
      imageSource(){
          if(this.state.profilePic == "/no_avatar.png"){
              return require('./home/img/no_avatar.png');
          }
          else{
              return {uri: this.props.profilePic}
          }
      }
      renderNavigationView(){
          let accountItem = (
              <View>
                <Image source={this.imageSource()} style= {{ height:75, width: 75 , borderRadius: 75}}/>
                  <Text style={styles.email}>
                      {this.state.email}
                  </Text>
              </View>
          );
          return(
              <View style={styles.drawer}>
                  <Image style={styles.header} source={require('../img/drawer-header.png')}>
                    {accountItem}
                  </Image>
                  <ScrollView>
                      <MenuItem
                          title="Home"
                          selected={this.props.tab === 'home'}
                          onPress={this.onTabSelect.bind(this, 'home')}
                          icon={'ios-map-outline'}
                          selectedIcon={'ios-map'}
                      />
                      <MenuItem
                          title="Appointments"
                          selected={this.props.tab === 'appointments'}
                          onPress={this.onTabSelect.bind(this, 'appointments')}
                          icon={'ios-calendar-outline'}
                          selectedIcon={'ios-calendar'}
                      />
                      <MenuItem
                          title="Safe Houses"
                          selected={this.props.tab === 'safeHouse'}
                          onPress={this.onTabSelect.bind(this, 'safeHouse')}
                          icon={'ios-home-outline'}
                          selectedIcon={'ios-home'}
                      />
                      <MenuItem
                          title="My Profile"
                          selected={this.props.tab === 'myProfile'}
                          onPress={this.onTabSelect.bind(this, 'myProfile')}
                          icon={'ios-person-outline'}
                          selectedIcon={'ios-person'}
                      />
                      <MenuItem
                          title="Contacts"
                          selected={this.props.tab === 'contacts'}
                          onPress={this.onTabSelect.bind(this, 'contacts')}
                          icon={'ios-contacts-outline'}
                          selectedIcon={'ios-contacts'}
                      />
                      <MenuItem
                          title="Groups"
                          selected={this.props.tab === 'groups'}
                          onPress={this.onTabSelect.bind(this, 'groups')}
                          icon={'ios-globe-outline'}
                          selectedIcon={'ios-globe'}
                      />
                      <MenuItem
                          title="Chats"
                          selected={this.props.tab === 'chats'}
                          onPress={this.onTabSelect.bind(this, 'chats')}
                          icon={'ios-chatboxes-outline'}
                          selectedIcon={'ios-chatboxes'}
                      />
                      <MenuItem
                          title="Help & Support"
                          selected={this.props.tab === 'help'}
                          onPress={this.onTabSelect.bind(this, 'help')}
                          icon={'ios-heart-outline'}
                          selectedIcon={'ios-heart'}
                      />
                      </ScrollView>
              </View>
          );
      }
      renderContent(){
          switch (this.props.tab) {
            case 'home':
                return(
                    <HomeTab
                        navigator={this.props.navigator}
                    />
            );
            case 'appointments':
                return(
                    <MBAppointmentsView />
            );
            case 'chats':
                return(
                    <MBChatsView />
                );
            case 'contacts':
                return(
                    <MBContactsView />
                );
            case 'groups':
                return(
                    <MBGroupsView />
                );
            case 'help':
                return(
                    <MBHelpView />
                );
            case 'myProfile':
                return(
                    <MBMyProfileView />
                );
            case 'safeHouse':
                return(
                    <MBSafeHouseView />
                );
          }
          throw new Error(`Unknown tab ${this.props.tab}`);
      }

    render(){
        return(
            <MBDrawerLayout
            ref="drawer"
            drawerWidth={290}
            drawerPosition="left"
            renderNavigationView={this.renderNavigationView}>
            <View style={styles.content} key={this.props.tab}>
              {this.renderContent()}
            </View>
            </MBDrawerLayout>
        );
    }
}

MBTabsView.childContextTypes = {
    openDrawer: React.PropTypes.func,
}

function select(store) {
    return {
      tab: store.navigation.tab,
      email: store.updateMeteorData.user && store.updateMeteorData.user.emails[0].address,
      profilePic : store.updateMeteorData.user && store.updateMeteorData.user.profile.avatarUrl,
    };
}

function actions(dispatch) {
  return {
    onTabSelect: (tab) => dispatch(switchTab(tab)),
  };
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    justifyContent: 'flex-end',
  },
  logo:{
      flex:1
  },
  email: {
    marginTop: 10,
    color: 'white',
    fontSize: 14,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  loginText: {
    fontSize: 12,
    color: MBColors.lightText,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default connect(select,actions)(MBTabsView);
