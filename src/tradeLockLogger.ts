import mongoHelper = require('./helpers/mongo');
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import { EmpireTradeLockLogger } from './workers/Worker/EmpireTradeLockLogger';
import db = require('./db');
import config = require('./config');

mongoHelper.connect();
db.sync();

const botId = config.BOT_ID;
const logger = new TelegramLogger();
const worker = new EmpireTradeLockLogger(botId, logger);
worker.schedule();