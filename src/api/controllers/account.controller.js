const express = require('express');
const { check, validationResult } = require('express-validator');
const shortid = require('shortid');
const jwt = require('jsonwebtoken');
const config = require('config');

// import services
const { findOneUser, createNewUser } = require('../../services/account.factory');

// config
const logger = require('../../../config/logger');

const router = express.Router();

router.get('/', (req, res) => res.send('Account Route'));

/**
 * @api {post} /newAccount Register New Account
 * @apiVersion 0.1.0
 * @apiName Register New Account
 * @apiGroup Account
 * @apiPermission public
 * @apiDescription This method will create a new user account
 * @apiExample Example Usage:
 * curl -i http://localhost:5000/api/account/newAccount
 *
 * @apiSuccess {String} name name of the user
 * @apiSuccess {String} email email of the user
 * @apiSuccess {String} password password of the user
 * @apiSuccess {Number} mobileNumber mobile number registered by the user
 */
router.post(
  '/newAccount',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is Invalid').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
    check('password', 'Password must be 8 or more characters').isLength({ min: 6 }),
    check('mobileNumber', 'Mobile Number is required').not().isEmpty(),
    check('mobileNumber', 'Mobile Number must be numeric').not().isAlpha(),
    check('email', 'Email is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, mobileNumber } = req.body;

    // generate connection id
    const connectionId = shortid.generate();
    res.set('x-conversation-id', connectionId);

    // check if user exists
    const found = await findOneUser({ email }, connectionId);

    logger.debug({ message: found, connectionId });

    if (found.status === 200) {
      return res.status(400).json({ message: `${mobileNumber} already exists` });
    }

    const newUser = await createNewUser({ name, email, password, mobileNumber }, connectionId);

    const token = await jwt.sign(newUser.payload, config.get('app.jwt.secret'), {
      expiresIn: 3600,
    });

    return res.status(newUser.status).json({ result: newUser, token });
  }
);

module.exports = router;
