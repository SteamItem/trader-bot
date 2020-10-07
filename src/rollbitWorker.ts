import mongoHelper = require('./helpers/mongo');
import { RollbitCsGoWorker } from "./workers/Worker/RollbitCsGoWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import { RollbitApi } from './api/rollbit';
import config = require('./config');

mongoHelper.connect();

const botId = config.BOT_ID;
const api = new RollbitApi();
const logger = new TelegramLogger();
const worker = new RollbitCsGoWorker(botId, api, logger);
worker.schedule();
