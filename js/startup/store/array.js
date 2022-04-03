
module.exports = () => next => (action) => {
  Array.isArray(action)
    ? action.map(next)
    : next(action);
};
