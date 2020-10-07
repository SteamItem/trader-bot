import mongoHelper = require('./helpers/mongo');
import { RollbitCsGoLogger } from "./workers/Worker/RollbitCsGoLogger";
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import db = require('./db');

mongoHelper.connect();
db.sync();

const logger = new TelegramLogger();
const worker = new RollbitCsGoLogger(logger);
worker.schedule();
