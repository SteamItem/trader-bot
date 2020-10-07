import pm2 = require('pm2');
import Bot, { IBot } from '../models/bot';
import { EnumBot, getBotText } from '../helpers/enum';
import config = require('../config');
import telegramController = require("./telegram");

async function findOne(id: EnumBot): Promise<IBot> {
  const bot = await Bot.findOne({ id }).exec();
  return bot;
}

async function update(id: number, worker: boolean, code: string): Promise<IBot> {
  await manageBot(id, worker);
  await sendBotMessage(id, worker);
  return await Bot.findOneAndUpdate({ id }, { worker, code }).exec();
}

function manageBot(id: EnumBot, worker: boolean) {
  if (worker) {
    return startBot(id);
  } else {
    return stopBot(id);
  }
}

function sendBotMessage(bot: EnumBot, worker: boolean) {
  const botText = getBotText(bot);
  const state = worker ? "Started" : "Stopped";
  const message = `${botText}: ${state}`;
  return telegramController.sendMessage(message);
}

function getBotFileName(id: EnumBot) {
  switch (id) {
    case EnumBot.EmpireInstant: return "instantWorker";
    case EnumBot.EmpireTradeLockLogger: return "tradeLockLogger";
    case EnumBot.RollbitCsGo: return "rollbitWorker";
    case EnumBot.RollbitCsGoLogger: return "rollbitLogger";
    case EnumBot.DuelbitsCsGoWorker: return "duelbitsWorker";
    default: throw new Error("Bot not found");
  }
}

function getWorkerPath(fileName: string) {
  return `./dist/src/${fileName}.js`;
}

async function stopBot(id: number) {
  const botFileName = getBotFileName(id);
  pm2.stop(botFileName, function(err) {
    pm2.disconnect();
    if (err) throw err
  });
}

async function startBot(id: number) {
  const botFileName = getBotFileName(id);
  const workerPath = getWorkerPath(botFileName);
  pm2.connect(err => {
    if (err) {
      console.error(err);
      throw err;
    }
    pm2.start({
      script: workerPath,
      name: botFileName,
      env: {
        NODE_ENV: config.NODE_ENV,
        DB_URL: config.DB_URL,
        RDB_URL: config.RDB_URL,
        TELEGRAM_TOKEN: config.TELEGRAM_TOKEN,
        TELEGRAM_CHAT_ID: config.TELEGRAM_CHAT_ID
      }
    }, function(err) {
      pm2.disconnect();
      if (err) throw err
    });
  });
}

async function handleBots() {
  const bots = await Bot.find({worker: true}).exec();
  bots.forEach(async bot => {
    await startBot(bot.id);
  });
}

export = {
  findOne,
  update,
  handleBots
}