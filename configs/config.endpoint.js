const development = {
  endpoint: {
    client: process.env.DEV_ENDPOINT_CLIENT,
  },
};
const production = {
  endpoint: {
    client: process.env.PRO_ENDPOINT_CLIENT,
  },
};

const config = { development, production };

module.exports = config[process.env.NODE_ENV || "development"];
