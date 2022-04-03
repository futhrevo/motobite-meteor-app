
function warn(error) {
  console.warn(error.message || error);
  throw error; // To let the caller handle the rejection
}

export default function (store) {
  return function (next) {
    return function (action) {
      typeof action.then === 'function'
                  ? Promise.resolve(action).then(next, warn)
                  : next(action);
    };
  };
}
