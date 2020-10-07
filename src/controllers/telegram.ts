import TelegramBot = require('node-telegram-bot-api');
import config = require('../config');
const bot = new TelegramBot(config.TELEGRAM_TOKEN);

async function sendMessage(message: string): Promise<TelegramBot.Message> {
  return bot.sendMessage(config.TELEGRAM_CHAT_ID, message);
}

export = {
  sendMessage
}