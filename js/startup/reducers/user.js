// @flow
import type { Action } from '../../imports/actions/types';

type MeteorStatus = {
    connected: boolean;
    status: string;
    retryCount: number;
    retryTime?: number;
    reason?: string;
}

type State = {
    user: ?Object;
    status: ?MeteorStatus;
    loggingIn: ?boolean;
    isLoggedIn: boolean;
    id: ?string;
}

const initialState: State = { user: null,
  status: null,
  loggingIn: null,
  isLoggedIn: false,
  id: null,
  message: null };

function user(state: State = initialState, action: Action): State {
  if (action.type === 'LOGGED_IN') {
    const { id } = action.data;
    return { ...state,
      isLoggedIn: true,
      id,
    };
  }
  if (action.type === 'UPDATE_METEOR_DATA') {
    return { ...state, user: action.user, status: action.status, loggingIn: action.loggingIn };
  }
  if (action.type === 'UPDATE_SERVER_STATUS') {
    return { ...state, status: action.status, loggingIn: action.loggingIn };
  }
  if (action.type === 'CHANGE_PASSWORD') {
    return Object.assign({}, state, { message: 'Password Changed Successfully' });
  }
  if (action.type === 'LOGGED_OUT') {
    return initialState;
  }
  return state;
}

export default user;

