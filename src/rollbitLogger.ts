import mongoHelper = require('./helpers/mongo');
import { RollbitCsGoLogger } from "./workers/Worker/RollbitCsGoLogger";
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import db = require('./db');
import config = require('./config');

mongoHelper.connect();
db.sync();

const botId = config.BOT_ID;
const logger = new TelegramLogger();
const worker = new RollbitCsGoLogger(botId, logger);
worker.schedule();
