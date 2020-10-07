import { EnumBot, getBotText } from "../../helpers/enum";

export interface ILogger {
  handleError(bot: EnumBot, taskName: string, message: string): void,
  handleMessage(bot: EnumBot, taskName: string, message: string): void,
  log(message: string): void
}

export abstract class LoggerBase implements ILogger {
  protected site: string;
  protected bot: string;
  handleError(bot: EnumBot, taskName: string, message: string): void {
    const botText = getBotText(bot);
    const logMessage = `[ERROR] ${botText}/${taskName}: ${message}`;
    this.log(logMessage);
  }
  handleMessage(bot: EnumBot, taskName: string, message: string): void {
    const botText = getBotText(bot);
    const logMessage = `${botText}/${taskName}: ${message}`;
    this.log(logMessage);
  }
  abstract log(message: string): void;
}
