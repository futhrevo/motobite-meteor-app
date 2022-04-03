
import type { Action } from './types';

module.exports = {
  updateMeteorData: (user: ?Object, status: ?Object, loggingIn: ?boolean): Action => ({
    type: 'UPDATE_METEOR_DATA',
    user,
    status,
    loggingIn,
  }),
  updateMeteorServerStatus: (status: ?Object, loggingIn: ?boolean): Action => ({
    type: 'UPDATE_SERVER_STATUS',
    status,
    loggingIn,
  }),
  meteorLoggedout: (): Action => ({
    type: 'LOGGED_OUT',
  })
};
