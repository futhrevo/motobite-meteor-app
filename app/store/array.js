

export default function (store) {
  return function (next) {
    return function (action) {
      Array.isArray(action)
                  ? action.map(next)
                  : next(action);
    };
  };
}
