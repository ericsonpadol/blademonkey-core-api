/*
 *  This is the default license template.
 *
 *  File: server.js
 *  Author: ebp
 *  Copyright (c) 2020 ebp
 *
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

/*
 *  This is the default license template.
 *
 *  File: server.js
 *  Author: ebp
 *  Copyright (c) 2020 ebp
 *
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */
const config = require('config');

const app = require('./app');
const logger = require('./config/logger');

const port = process.env.PORT || config.get('server.port');

app.listen(port, () => logger.info(`Server Started on port ${port}`));
