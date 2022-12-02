module.exports = function (actual, expected, options) {
  if (options.fn && actual === expected) {
    return options.fn(this);
  } else if (options.fn) {
    return options.inverse(this);
  } else {
    return actual === expected;
  }
}
