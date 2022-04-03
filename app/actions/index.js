

import navigationActions from './navigation';
import meteorDataActions from './updateMeteorData';
import localDataActions from './updateLocalStore';

module.exports = {
  ...navigationActions,
  ...meteorDataActions,
  ...localDataActions,
};
