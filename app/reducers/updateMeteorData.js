'use strict';

import type {Action} from '../actions/types';

type MeteorStatus = {
    connected: boolean;
    status: string;
    retryCount: number;
    retryTime?: number;
    reason?: string;
}

type State = {
    user:?Object;
    status: ?MeteorStatus;
    loggingIn: ?boolean;
}

const initialState: State = { user: null, status: null, loggingIn: null};

function updateMeteorData(state: State = initialState, action: Action): State {
    if (action.type === 'UPDATE_METEOR_DATA') {
      return {...state, user: action.user, status: action.status, loggingIn: action.loggingIn};
    }
    if (action.type === 'LOGGED_OUT') {
      return initialState;
    }
    return state;
}

export default updateMeteorData;
