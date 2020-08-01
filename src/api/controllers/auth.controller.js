const express = require('express');
const { authorization } = require('blademonkey-authentication-service');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const config = require('config');

const { findAccountById, findOneUser } = require('../../services/account.factory');
const { checkPasscode } = require('../../services/authentication.factory');

const logger = require('../../../config/logger');

const router = express.Router();

/**
 * @api {get} / authorized account by id
 * @apiVersion 0.1.0
 * @apiName Authenticate Account by Id
 * @apiGroup Authentication
 * @apiPermission private
 * @apiDescription This method will check if the user has valid auth token.
 * @apiSampleRequest http://localhost:5000
 */
router.get('/', [authorization], async (req, res) => {
  // generate connection id
  const connectionId = shortid.generate();
  res.set('x-conversation-id', connectionId);
  logger.info({ connectionId, message: req.account });

  const result = await findAccountById({ userId: req.account.id });
  logger.info({ connectionId, message: result });

  return res.status(result.status).json(result);
});

/**
 * @api {post} /login login endpoint
 * @apiVersion 0.1.0
 * @apiName Login by mobile number
 * @apiGroup Authentication
 * @apiPermission public
 * @apiDescription This method will login the user
 */
router.post('/login', async (req, res) => {
  // generate connection id
  const connectionId = shortid.generate();
  res.set('x-conversation-id', connectionId);

  const { mobileNumber, password } = req.body;

  // check if the user exist
  const user = await findOneUser({ mobileNumber }, connectionId);

  logger.info({ connectionId, message: user });

  if (user.status === 404) {
    return res.status(401).json({ errors: { msg: 'Invalid Credentials' } });
  }

  const isMatch = await checkPasscode(password, user.data.password);

  logger.debug({ connectionId, message: isMatch });

  if (!isMatch) {
    return res.status(401).json({ errors: { msg: 'Invalid Credentials' } });
  }

  const payload = { user: { id: user.data.id } };

  try {
    const token = await jwt.sign(payload, config.get('app.jwt.secret'), { expiresIn: 3600 });

    return res.status(user.status).json({ token });
  } catch (error) {
    logger.error({ connectionId, error });
    throw error;
  }
});

module.exports = router;
