

import React, { PropTypes } from 'react';
import t from 'tcomb-form-native';
const Form = t.form.Form;
import { LOGIN, REGISTER, CHANGE_PASSWORD, FORGOT_PASSWORD } from './MBConstants';
const MBAccountsForm = React.createClass({
    /**
      * ## MBAccounts class
      *
      * * form: the properties to set into the UI form
      * * value: the values to set in the input fields
      * * onChange: function to call when user enters text
      */
  propTypes: {
    formType: PropTypes.string,
    form: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func,
  },
    /**
     * ## render
     *
     * setup all the fields using the props and default messages
     *
     */
  render() {
    const formType = this.props.formType;

    const options = {
        //   auto: 'placeholders',
      fields: {

      },
    };
    const username = {
      label: 'Username',
      maxLength: 12,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.usernameHasError,
      error: 'Must have 6-12 characters and/or numbers',
    };

    const email = {
      label: 'Email',
      keyboardType: 'email-address',
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.emailHasError,
      error: 'Please enter valid email',
    };
    const password = {
      label: 'Password',
      maxLength: 12,
      secureTextEntry: true,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.passwordHasError,
      error: 'Must have 6-12 characters with at least 1 number and 1 special character',
    };

    const passwordAgain = {
      label: 'Please enter password again',
      secureTextEntry: true,
      maxLength: 12,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.passwordAgainHasError,
      error: 'Passwords must match',
    };
    const oldpassword = {
      label: 'Old Password',
      maxLength: 12,
      secureTextEntry: true,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.oldpasswordHasError,
      error: 'Must have 6-12 characters with at least 1 number and 1 special character',
    };
    const newpassword = {
      label: 'New Password',
      maxLength: 12,
      secureTextEntry: true,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.newpasswordHasError,
      error: 'Must have 6-12 characters with at least 1 number and 1 special character',
    };
    const confirmpassword = {
      label: 'Confirm New Password',
      maxLength: 12,
      secureTextEntry: true,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.confirmpasswordHasError,
      error: 'Must match new password',
    };

    let mbform;
    switch (formType) {
      case (CHANGE_PASSWORD):
        mbform = t.struct({
          oldpassword: t.String,
          newpassword: t.String,
          confirmpassword: t.String,
        });
        options.fields.oldpassword = oldpassword;
        options.fields.newpassword = newpassword;
        options.fields.confirmpassword = confirmpassword;
        break;
    } // switch

        /**
         * ### Return
         * returns the Form component with the correct structures
         */
    return (
      <Form
        ref="form"
        type={mbform}
        options={options}
        value={this.props.value}
        onChange={this.props.onChange}
      />

    );
  },
});

export default MBAccountsForm;
