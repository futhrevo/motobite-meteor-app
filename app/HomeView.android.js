import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import {Actions} from 'react-native-router-flux';
import MBDrawerLayout from './common/MBDrawerLayout';
import MBColors from './common/MBColors';

import MenuItem from './MenuItem';
import type {Tab} from './reducers/navigation';
import HomeTab from './HomeTab';

class HomeView extends Component{
    props:{
        tab: Tab;
        onTabSelect: (tab: Tab) => void;
    }

    constructor(props) {
        super(props);

        this.renderNavigationView = this.renderNavigationView.bind(this);
        this.openDrawer = this.openDrawer.bind(this);
    }

    openDrawer() {
        this.refs.drawer.openDrawer();
      }

    onTabSelect(tab: Tab) {
        if (this.props.tab !== tab) {
        //   this.props.onTabSelect(tab);
        Actions.hometab;
        }
        this.refs.drawer.closeDrawer();
      }
    renderNavigationView(){
        return(
            <View style={styles.drawer}>
                <Image style={styles.header} source={require('./img/drawer-header.png')}>

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
                        selected={this.props.tab === 'groups'}
                        onPress={this.onTabSelect.bind(this, 'groups')}
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
                    <HomeTab />
                );

            case 'appointments':
                return(
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Appointments Screen</Text>
                     </View>
                );
            default:
                return(
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Default Screen</Text>
                     </View>
                );
        }
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
  name: {
    marginTop: 10,
    color: 'white',
    fontSize: 12,
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

export default HomeView;
