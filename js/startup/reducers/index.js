import { combineReducers } from 'redux';

import user from './user';
import drawer from './drawer';
import cardNavigation from './cardNavigation';
// import updateMeteorData from './updateMeteorData';
import updateLocalStore from './updateLocalStore';

export default combineReducers({
  user,
  drawer,
  cardNavigation,
  // updateMeteorData,
  updateLocalStore,
});
