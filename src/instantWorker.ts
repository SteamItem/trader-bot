import mongoHelper = require('./helpers/mongo');
import { EmpireInstantWorker } from "./workers/Worker/EmpireInstantWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import config = require('./config');

mongoHelper.connect();

const botId = config.BOT_ID;
const logger = new TelegramLogger();
const worker = new EmpireInstantWorker(botId, logger);
worker.schedule();