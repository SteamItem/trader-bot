import { LoggerBase } from "./LoggerBase";
import telegramController = require("../../controllers/telegram");
import TelegramBot = require("node-telegram-bot-api");

export class TelegramLogger extends LoggerBase {
  log(message: string): Promise<TelegramBot.Message> {
    return telegramController.sendMessage(message);
  }
}
