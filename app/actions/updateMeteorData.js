'use strict';

import type { Action } from './types';

module.exports = {
  updateMeteorData: (user:?Object, status:?Object, loggingIn:?boolean): Action => ({
    type: 'UPDATE_METEOR_DATA',
    user,
    status,
    loggingIn,
  }),
};
