import mongoHelper = require('./helpers/mongo');
import { EmpireInstantWorker } from "./workers/Worker/EmpireInstantWorker";
import { TelegramLogger } from './workers/Logger/TelegramLogger';

mongoHelper.connect();

const logger = new TelegramLogger();
const worker = new EmpireInstantWorker(logger);
worker.schedule();