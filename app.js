/*
 *  This is the default license template.
 *
 *  File: app.js
 *  Author: ebp
 *  Copyright (c) 2020 ebp
 *
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

/*
 *  This is the default license template.
 *
 *  File: app.js
 *  Author: Ericson Padol
 *  Copyright (c) 2020 ebp
 *
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */
const express = require('express');
const DB = require('blademonkey-data-entities');
const shortid = require('shortid');
const faker = require('faker');
const helmet = require('helmet');
const nocache = require('nocache');
const cors = require('cors');

const logger = require('./config/logger');

const app = express();
const hstsMaxAge = 31536000; // max value

logger.info('Initiliazing App...');

// applying security patches
app.disable('x-powered-by');

app.use(
  helmet.hsts({
    maxAge: hstsMaxAge,
    includeSubDomains: true,
    preload: true,
  })
);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['*'],
      styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ['*', 'data:'],
      mediaSrc: ['*'],
      fontSrc: ['*'],
      objectSrc: ["'self'"],
    },
    browserSniff: false,
  })
);

app.use(helmet.xssFilter());

app.use(helmet.noSniff());

app.use(nocache());

app.use(
  helmet.frameguard({
    action: 'sameorigin',
  })
);

app.use(cors());

logger.info(`${faker.name.firstName()}-${shortid.generate()}`);

// connect to mongodb
DB.connectDB();

// initiliaze routes
app.use('/api/account', require('./src/api/controllers/account.controller'));

module.exports = app;
