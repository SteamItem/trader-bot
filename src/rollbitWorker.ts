import mongoHelper = require('./helpers/mongo');
import { RollbitCsGoWorker } from "./workers/Worker/RollbitCsGoWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';
import { RollbitApi } from './api/rollbit';

mongoHelper.connect();

const logger = new TelegramLogger();
const api = new RollbitApi();
const worker = new RollbitCsGoWorker(api, logger);
worker.schedule();
