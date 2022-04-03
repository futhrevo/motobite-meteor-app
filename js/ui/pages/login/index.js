import React, { Component } from 'react';
import { Image, StatusBar, ToastAndroid } from 'react-native';
import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import {
  Button,
  Container,
  Content,
  Item,
  Input,
  Icon,
  Text,
  View
} from 'native-base';
import SplashScreen from 'react-native-splash-screen';
import _ from 'lodash';

import styles from './styles';
import {
  MeteorloginWithPassword,
  MeteorCreateUser,
  forgotPassword
} from '../../../imports/actions/login';
import Validator from 'validatorjs';
import lang from 'validatorjs/src/lang';
import en from 'validatorjs/src/lang/en';

lang._set('en', en);

const background = require('../../../../images/mb.png');

const { replaceAt } = actions;
const rules = {
  email: 'required|email',
  password: ['required_unless:intent,reset', 'regex:/^[a-zA-Z0-9]{3,30}$/'],
  password_confirmation: ['required_if:intent,register', 'same:password'],
  intent: 'required|string'
};

class Login extends Component {
  static propTypes = {
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.setSignInState = this.setSignInState.bind(this);
    this.setRegisterState = this.setRegisterState.bind(this);
    this.setResetState = this.setRegisterState.bind(this);
    this.replaceRoute = this.replaceRoute.bind(this);
    this.state = {
      email: '',
      password: '',
      error: null,
      password_confirmation: '',
      intent: 'signin'
    };
  }
  componentDidMount() {
    // do anything while splash screen keeps, use await to wait for an async task.
    SplashScreen.hide();
  }
  async onSignIn() {
    const { email, password } = this.state;
    console.log('credentials are valid');
    try {
      await Promise.race([
        this.props.loginAction(email, password),
        timeout(15000)
      ]);
    } catch (e) {
      const reason = e.reason || e;
      this.setState({ error: reason });
    }
  }

  async onCreateAccount() {
    const { email, password } = this.state;
    try {
      await Promise.race([
        this.props.createAccountAction(email, password),
        timeout(15000)
      ]);
    } catch (e) {
      const reason = e.reason || e;
      this.setState({ error: reason });
    }
  }
  async onForgotPassword() {
    const { email } = this.state;
    try {
      await Promise.race([forgotPassword(email), timeout(15000)]);
      ToastAndroid.show('Check Email for Instructions', ToastAndroid.SHORT);
      this.setSignInState();
    } catch (e) {
      const reason = e.reason || e;
      this.setState({ error: reason });
    }
  }
  setSignInState() {
    this.setState({ intent: 'signin' });
  }
  setResetState() {
    this.setState({ intent: 'reset' });
  }
  setRegisterState() {
    this.setState({ intent: 'register' });
  }
  replaceRoute(route) {
    this.props.replaceAt('login', { key: route }, this.props.navigation.key);
  }

  isValid() {
    const validation = new Validator(this.state, rules);
    if (validation.passes()) {
      this.setState({ error: '' });
      if (this.state.intent === 'signin') {
        this.onSignIn();
      } else if (this.state.intent === 'register') {
        this.onCreateAccount();
      } else if (this.state.intent === 'reset') {
        this.onForgotPassword();
      }
    } else {
      if (validation.errors.first('email')) {
        this.setState({ error: 'Invalid email address' });
      } else if (validation.errors.first('password')) {
        this.setState({ error: 'Requires Password to be alphanumeric' });
      } else if (validation.errors.first('password_confirmation')) {
        this.setState({ error: 'Passwords does not match ' });
      } else {
        this.setState({ error: 'Unknown error' });
      }
    }
  }

  render() {
    const currentState = this.state.intent;
    const emailEntry = (
      <Item>
        <Icon active name="ios-person-outline" />
        <Input
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          keyboardType={'email-address'}
        />
      </Item>
    );
    const ConfirmEntry = (
      <Item>
        <Icon active name="ios-unlock-outline" />
        <Input
          placeholder="Confirm password"
          secureTextEntry
          onChangeText={pass => this.setState({ password_confirmation: pass })}
        />
      </Item>
    );
    const passwordEntry = (
      <Item>
        <Icon active name="ios-unlock-outline" />
        <Input
          placeholder="Password"
          secureTextEntry
          onChangeText={password => this.setState({ password })}
        />
      </Item>
    );
    const resetButton = (
      <Text
        style={{ padding: 5, textAlign: 'right' }}
        onPress={() => this.setState({ intent: 'reset' })}
      >
        Forgot Password ?
      </Text>
    );
    function ActionButton(props) {
      let actionText = 'Sign In';
      if (currentState === 'register') {
        actionText = 'Register';
      }
      if (currentState === 'reset') {
        actionText = 'Reset Password';
      }
      return (
        <Button
          primary
          rounded
          block
          style={{ margin: 10 }}
          onPress={props.onPress}
        >
          <Text>{actionText}</Text>
        </Button>
      );
    }
    function FooterActions(props) {
      let fbtext = 'Sign In';
      let altActionText = 'Register';
      if (currentState === 'register') {
        fbtext = 'Sign Up';
        altActionText = 'Sign In';
      }
      if (currentState === 'reset') {
        altActionText = 'Sign In';
      }
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10
          }}
        >
          <Button iconLeft>
            <Icon name="logo-facebook" />
            <Text>{fbtext}</Text>
          </Button>
          <Button primary transparent onPress={props.onPress}>
            <Text>{altActionText}</Text>
          </Button>
        </View>
      );
    }
    const signinForm = (
      <View>
        {emailEntry}
        {passwordEntry}
        {resetButton}
        <ActionButton onPress={() => this.isValid()} />
        <FooterActions onPress={this.setRegisterState} />
      </View>
    );
    const resetPasswordForm = (
      <View>
        {emailEntry}
        <ActionButton onPress={() => this.isValid()} />
        <FooterActions onPress={this.setSignInState} />
      </View>
    );
    const registerForm = (
      <View>
        {emailEntry}
        {passwordEntry}
        {ConfirmEntry}
        <ActionButton onPress={() => this.isValid()} />
        <FooterActions onPress={this.setSignInState} />
      </View>
    );
    return (
      <Container>
        <StatusBar barStyle="dark-content" backgroundColor="#e5f3ec" />
        <Content padder style={styles.container}>
          <Image source={background} style={styles.logoContainer} />
          <View style={{ padding: 20, position: 'relative' }}>
            <Text style={styles.error}>{this.state.error}</Text>
            {this.state.intent === 'signin'
              ? signinForm
              : this.state.intent === 'reset'
              ? resetPasswordForm
              : registerForm}
          </View>
        </Content>
      </Container>
    );
  }
}

async function timeout(ms: number): Promise {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) =>
      dispatch(replaceAt(routeKey, route, key)),
    loginAction: (email, password) =>
      dispatch(MeteorloginWithPassword(email, password)),
    createAccountAction: (email, password, mobile) =>
      dispatch(MeteorCreateUser(email, password, mobile))
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation
});

export default connect(
  mapStateToProps,
  bindActions
)(Login);
