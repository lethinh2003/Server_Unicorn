const DEFAULT_LIMIT_ITEMS = 10;

const development = {
  pagination: {
    limitItems: {
      voucher: process.env.DEV_LIMIT_ITEMS * 1 || DEFAULT_LIMIT_ITEMS,
    },
  },
};
const production = {
  pagination: {
    limitItems: {
      voucher: process.env.PRO_LIMIT_ITEMS * 1 || DEFAULT_LIMIT_ITEMS,
    },
  },
};

const config = { development, production };

module.exports = config[process.env.NODE_ENV || "development"];
