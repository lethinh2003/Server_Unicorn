const { compare, hash } = require("bcrypt");
const saltRounds = 10;
const hashPassword = async (password) => {
  const result = await hash(password, saltRounds);
  return result;
};
const comparePassword = async (password, userPassword) => {
  const result = await compare(password, userPassword);
  return result;
};
module.exports = { hashPassword, comparePassword };
