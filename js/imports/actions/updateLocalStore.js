
import type { Action } from './types';

module.exports = {
  updateOneSignalData: (signalUserId: ?String): Action => ({
    type: 'UPDATE_ONESIGNAL_DATA',
    signalUserId,
  }),
};
