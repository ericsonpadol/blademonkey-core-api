const bcrypt = require('bcryptjs');

const generateSalt = async () => {
  const salt = await bcrypt.genSalt(10);
  return salt;
};

const encrypt = async (value, salt) => {
  const result = await bcrypt.hash(value, salt);
  return result;
};

module.exports = { generateSalt, encrypt };
