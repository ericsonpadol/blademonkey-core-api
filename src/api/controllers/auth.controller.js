const express = require('express');
const { authorization } = require('blademonkey-authentication-service');
const shortid = require('shortid');

const { findAccountById } = require('../../services/account.factory');
const logger = require('../../../config/logger');

const router = express.Router();

/**
 * @api {get} / authorized account by id
 * @apiVersion 0.1.0
 * @apiName Authenticate Account by Id
 * @apiGroup Authentication
 * @apiPermission private
 * @apiDescription This method will check if the user has valid auth token.
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

module.exports = router;
