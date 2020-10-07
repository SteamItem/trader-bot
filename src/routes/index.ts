import express = require('express');
import common = require('./common');
import botParam = require('./botParam');

function registerRoutes(app: express.Express) {
  common(app);
  botParam(app);
}

export {
  registerRoutes
}