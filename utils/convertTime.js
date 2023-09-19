const dayjs = require("dayjs");

var relativeTime = require("dayjs/plugin/relativeTime");
var utc = require("dayjs/plugin/utc");
dayjs.extend(relativeTime);
dayjs.extend(utc);

const convertTime = (timeISOString) => {
  const now = dayjs(new Date());
  let result = dayjs(timeISOString).from(now);

  return result;
};
const convertDateTime = (timeISOString) => {
  let result = dayjs(timeISOString).format("YYYY-MM-DD HH:mm");

  return result;
};
module.exports = {
  convertTime,
  convertDateTime,
};
