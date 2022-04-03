import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, Form, Item, Label, Input } from 'native-base';

import { openDrawer } from '../../../imports/actions/drawer';
import styles from './styles';

const {
  popRoute,
} = actions;

class PasswordChange extends Component {

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
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.popRoute()}>
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{'Change Password'}</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Form>
            <Item placeholderLabel>
              <Input placeholder="Old Password" secureTextEntry />
            </Item>
            <Item last placeholderLabel>
              <Input placeholder="New Password" secureTextEntry />
            </Item>
            <Item placeholderLabel>
              <Input placeholder="Confirm New Password" secureTextEntry />
            </Item>
          </Form>
          <Button block style={{ margin: 15, marginTop: 50 }}>
            <Text>Change Password</Text>
          </Button>
        </Content>
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


export default connect(mapStateToProps, bindAction)(PasswordChange);
