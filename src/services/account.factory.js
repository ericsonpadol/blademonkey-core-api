const { Account } = require('blademonkey-data-entities');
const gravatar = require('gravatar');

const Authentication = require('./authentication.factory');
const logger = require('../../config/logger');

/**
 * @method createNewUser
 * @description a function that will create a new user
 */
const createNewUser = async (args = {}, connectionId) => {
  try {
    // get avatar
    const avatar = gravatar.url(args.email, {
      s: '200',
      d: 'mm',
    });

    // create new user
    const user = new Account({
      name: args.name,
      email: args.email,
      password: args.password,
      mobileNumber: args.mobileNumber,
      avatar,
    });

    user.password = await Authentication.encrypt(
      args.password,
      await Authentication.generateSalt()
    );

    const result = await user.save();

    logger.info({ result, connectionId });

    return {
      status: 200,
      message: `${user.mobileNumber} successfully registered`,
      data: result,
    };
  } catch (error) {
    logger.error(error.message);
    return {
      status: 500,
      message: error.message,
    };
  }
};

const findOneUser = async (args = {}, connectionId) => {
  try {
    const found = await Account.findOne({
      email: args.email,
    });

    logger.info({ data: found, connectionId });

    if (found) {
      return {
        data: found,
        status: 200,
      };
    }

    return {
      data: [],
      status: 404,
    };
  } catch (error) {
    logger.error(error.message);
    return {
      status: 500,
      message: error.message,
    };
  }
};

module.exports = {
  createNewUser,
  findOneUser,
};
