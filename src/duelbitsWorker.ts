import mongoHelper = require('./helpers/mongo');
import { DuelbitsCsGoWorker } from "./workers/Worker/DuelbitsCsGoWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import { DuelbitsApi } from './api/duelbits';

mongoHelper.connect();

const logger = new TelegramLogger();
const api = new DuelbitsApi();
const worker = new DuelbitsCsGoWorker(api, logger);
worker.schedule();
