const development = {
  endpoint: {
    client: process.env.DEV_ENDPOINT_CLIENT,
    server: process.env.DEV_ENDPOINT_SERVER,
  },
};
const production = {
  endpoint: {
    client: process.env.PRO_ENDPOINT_CLIENT,
    server: process.env.PRO_ENDPOINT_SERVER,
  },
};

const config = { development, production };

module.exports = config[process.env.NODE_ENV || "development"];
