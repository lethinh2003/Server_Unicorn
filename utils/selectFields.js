const _ = require("lodash");

const selectFields = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
module.exports = {
  selectFields,
};
