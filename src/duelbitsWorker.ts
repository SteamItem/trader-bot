import mongoHelper = require('./helpers/mongo');
import { DuelbitsCsGoWorker } from "./workers/Worker/DuelbitsCsGoWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import { DuelbitsApi } from './api/duelbits';
import config = require('./config');

mongoHelper.connect();

const botId = config.BOT_ID;
const api = new DuelbitsApi();
const logger = new TelegramLogger();
const worker = new DuelbitsCsGoWorker(botId, api, logger);
worker.schedule();
