

import { combineReducers } from 'redux';
import navigation from './navigation';
import user from './user';
import updateMeteorData from './updateMeteorData';
import updateLocalStore from './updateLocalStore';

export default combineReducers({
  navigation,
  user,
  updateMeteorData,
  updateLocalStore,
});
