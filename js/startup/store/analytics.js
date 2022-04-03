import track from './track';

module.exports = () => next => (action) => {
  track(action);
  return next(action);
};
