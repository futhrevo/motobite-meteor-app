import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { Bert } from 'meteor/themeteorchef:bert';
import { browserHistory } from 'react-router';

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  minimumPasswordLength: 6,
  loginPath: '/login',
  signUpPath: '/signup',
  resetPasswordPath: '/reset-password',
  changePasswordPath: '/change-password',
  homeRoutePath: '/',
  profilePath: '/profile',
  onPostSignUpHook: () => browserHistory.push('/'),
});

export default class NewLogin extends Accounts.ui.LoginForm {
  fields() {
    const { formState } = this.state;
    if (formState === STATES.SIGN_UP) {
      return {
        mobile: {
          id: 'mobile',
          hint: 'Enter mobile number',
          label: 'Mobile Number',
          required: true,
          onChange: this.handleChange.bind(this, 'mobile'),
        },
        ...super.fields(),
      };
    }
    return super.fields();
  }

  signUp(options = {}) {
    const { mobile = null } = this.state;
    console.log(mobile);
    if (mobile !== null && this.validateMobile(mobile)) {
      options.profile = Object.assign(options.profile || {}, {
        mobile,
      });
      super.signUp(options);
    } else {
      Bert.alert('Invalid mobile number', 'danger', 'growl-top-right');
    }
  }

  validateMobile(value) {
    const newValue = value.toString();
    const re = /^[789]\d{9}$/;
    if (re.test(newValue) && newValue.length === 10) {
      return true;
    }
    return false;
  }
}
