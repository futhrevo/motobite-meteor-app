

import validate from 'validate.js';
import _ from 'underscore';

/**
 * ## Email validation setup
 * Used for validation of emails
 */
const emailConstraints = {
  from: {
    email: true,
  },
};

/**
* ## password validation rule
* read the message... ;)
*/
const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/;
const passwordConstraints = {
  password: {
    format: {
      pattern: passwordPattern,
      flags: 'i',
      message: 'have at least a number and a special character,'
          + ' and between 6-12 in length',
    },
  },
};

const passwordAgainConstraints = {
  confirmPassword: {
    equality: 'password',
  },
};

export function MBFieldValidation(field, value) {
  switch (field) {
    case 'oldpassword':
      const validOldPswd = _.isUndefined(validate({ password: value }, passwordConstraints));
      if (validOldPswd) {
        return true;
      }
      return false;

    case 'newpassword':
      const validNewPswd = _.isUndefined(validate({ password: value }, passwordConstraints));
      if (validNewPswd) {
        return true;
      }
      return false;

    case 'confirmpassword':
      const confirmPswd = _.isUndefined(validate({ password: value }, passwordConstraints));
      if (confirmPswd) {
        return true;
      }
      return false;
  }
}
