// @flow
import type { Action } from '../../imports/actions/types';

type State = {
    signalUserId: ?string
}

const initialState: State = { signalUserId: null };

function updateLocalStore(state: State = initialState, action: Action): State {
  if (action.type === 'UPDATE_ONESIGNAL_DATA') {
    return { ...state, signalUserId: action.signalUserId };
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }
  return state;
}

export default updateLocalStore;
