

import track from './track';

export default function (store) {
  return function (next) {
    return function (action) {
      track(action);
      return next(action);
    };
  };
}
