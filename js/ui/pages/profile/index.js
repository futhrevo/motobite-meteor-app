import React, { Component } from 'react';
import { Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, ListItem, List, Item , Input, Label, Switch } from 'native-base';

import { openDrawer } from '../../../imports/actions/drawer';
import navigateTo from '../../../imports/actions/sideBarNav';

import styles from './styles';

const {
  popRoute,
} = actions;
const profileImage = require('../../../../images/noavatar.png');

class ProfilePage extends Component {
  static propTypes = {
    openDrawer: React.PropTypes.func,
    popRoute: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
    navigateTo: React.PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      displayName: 'Admin',
      email: 'admin@example.com',
      mobile: '9876543210',
      workEmail: 'admin@work.com',
      status: 'I love MotoBite',
    };
  }
  popRoute() {
    this.props.popRoute(this.props.navigation.key);
  }
  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.popRoute()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{'Profile'}</Title>
          </Body>
          <Right>
            <Button small transparent onPress={this.props.openDrawer}>
              <Text>Sign Out</Text>
            </Button>
          </Right>
        </Header>

        <Content padder>
          <List style={{ marginBottom: 20 }}>
            <ListItem>
              <Body>
                <Image source={profileImage} style={styles.profilePic} />
              </Body>
            </ListItem>
            <Item fixedLabel>
              <Label>Name</Label>
              <Input value={this.state.displayName} editable={false} />
            </Item>
            <Item fixedLabel>
              <Label>Status</Label>
              <Input value={this.state.status} editable={false} />
            </Item>
            <Item>
              <Icon active name="ios-mail" />
              <Input value={this.state.email} editable={false} />
            </Item>
            <Item>
              <Icon active name="ios-call" />
              <Input value={this.state.mobile} editable={false} />
            </Item>
            <ListItem itemDivider>
              <Text>Work</Text>
            </ListItem>
            <Item>
              <Icon active name="ios-briefcase" />
              <Input value={this.state.workEmail} editable={false} />
            </Item>
            <ListItem itemDivider>
              <Text>General</Text>
            </ListItem>
            <Item onPress={() => this.navigateTo('changePassword')}>
              <Icon active name="ios-key" />
              <Input value={'Change Password'} editable={false} />
            </Item>
            <ListItem icon>
              <Body>
                <Text>Push Notifications</Text>
              </Body>
              <Right>
                <Switch value={true} />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    navigateTo: (route, homeRoute) => dispatch(navigateTo(route, homeRoute)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});


export default connect(mapStateToProps, bindAction)(ProfilePage);
