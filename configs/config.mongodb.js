const development = {
  db: {
    stringConnect: process.env.DEV_DATABASE_STRING,
  },
};
const production = {
  db: {
    stringConnect: process.env.PRO_DATABASE_STRING,
  },
};

const config = { development, production };

module.exports = config[process.env.NODE_ENV || "development"];
