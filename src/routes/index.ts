import express = require('express');
import common = require('./common');
import bot = require('./bot');

function registerRoutes(app: express.Express) {
  common(app);
  bot(app);
}

export {
  registerRoutes
}