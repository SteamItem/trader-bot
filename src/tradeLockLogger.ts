import mongoHelper = require('./helpers/mongo');
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import { EmpireTradeLockLogger } from './workers/Worker/EmpireTradeLockLogger';
import db = require('./db');

mongoHelper.connect();
db.sync();

const logger = new TelegramLogger();
const worker = new EmpireTradeLockLogger(logger);
worker.schedule();