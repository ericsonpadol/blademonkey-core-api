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

    const payload = {
      account: {
        id: user.id,
      },
    };

    return {
      status: 200,
      message: `${user.mobileNumber} successfully registered`,
      data: result,
      payload,
    };
  } catch (error) {
    logger.error(error.message);
    return {
      status: 500,
      message: error.message,
    };
  }
};

/**
 *
 * @method findOneUser
 * @description This method will fetch one user by email
 */
const findOneUser = async (args = {}, connectionId) => {
  try {
    const found = await Account.findOne({
      $or: [{ email: args.email }, { mobileNumber: args.mobileNumber }],
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

const findAccountById = async (args = {}, connectionId) => {
  try {
    const user = await Account.findById(args.userId).select('-password');
    logger.info({ message: user, connectionId });

    if (!user) {
      return {
        data: [],
        status: 404,
      };
    }
    return {
      data: user,
      status: 200,
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
  findAccountById,
};
