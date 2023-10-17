const _ = require("lodash");

const selectFields = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const unSelectFields = ({ fields = [], object = {} }) => {
  return _.omit(object, fields);
};
module.exports = {
  selectFields,
  unSelectFields,
};
