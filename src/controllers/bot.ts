import pm2 = require('pm2');
import Bot, { IBot } from '../models/bot';
import { EnumBot } from '../helpers/enum';
import config = require('../config');

async function findById(id: string): Promise<IBot> {
  const bot = await Bot.findById(id).exec();
  return bot;
}

function getBotFileName(id: EnumBot) {
  switch (id) {
    case EnumBot.CsGoEmpire: return "instantWorker";
    case EnumBot.Rollbit: return "rollbitWorker";
    case EnumBot.RollbitLogger: return "rollbitLogger";
    case EnumBot.Duelbits: return "duelbitsWorker";
    default: throw new Error("Bot not found");
  }
}

function getWorkerPath(fileName: string) {
  return `./dist/src/${fileName}.js`;
}

async function stopBot(id: string) {
  const bot = await Bot.findById(id);
  pm2.stop(bot._id, function(err) {
    pm2.disconnect();
    if (err) throw err
  });
}

async function startBot(id: string) {
  const bot = await Bot.findById(id);
  const botFileName = getBotFileName(bot.type);
  const workerPath = getWorkerPath(botFileName);
  pm2.connect(err => {
    if (err) {
      console.error(err);
      throw err;
    }
    pm2.start({
      script: workerPath,
      name: bot._id,
      env: {
        NODE_ENV: config.NODE_ENV,
        BOT_ID: bot._id,
        DB_URL: config.DB_URL,
        RDB_URL: config.RDB_URL,
        TELEGRAM_TOKEN: config.TELEGRAM_TOKEN,
        TELEGRAM_CHAT_ID: config.TELEGRAM_CHAT_ID
      }
    }, function(err2) {
      pm2.disconnect();
      if (err2) throw err2
    });
  });
}

async function handleBots() {
  const bots = await Bot.find({worker: true}).exec();
  bots.forEach(async bot => {
    await startBot(bot._id);
  });
}

export = {
  findById,
  handleBots,
  startBot,
  stopBot
}