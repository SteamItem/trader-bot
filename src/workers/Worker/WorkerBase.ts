import cron = require('node-cron');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBot } from '../../models/bot';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { LoggerBase } from '../Logger/LoggerBase';
import { EnumBot } from '../../helpers/enum';
export abstract class WorkerBase {
  constructor(botId: string, logger: LoggerBase) {
    this.botId = botId;
    this.logger = logger;
  }

  protected botId: string;
  protected logger: LoggerBase;
  protected bot: IBot;
  protected wishlistItems: IWishlistItem[];
  private _working = false;
  private set working(value: boolean) {
    if (this._working === false && value === true) {
      this.start(this.bot);
    }
    this._working = value;
  }

  abstract enumBot: EnumBot;
  abstract start(bot: IBot): void;

  abstract getDatabaseSelector(): DatabaseSelectorTask;
  async schedule(): Promise<void> {
    const databaseScheduler = this.databaseScheduler();
    databaseScheduler.start();
  }

  private databaseScheduler() {
    return cron.schedule('* * * * * *', async () => {
      let currentTask = "databaseScheduler";
      try {
        const databaseSelector = this.getDatabaseSelector();
        currentTask = databaseSelector.taskName;
        await databaseSelector.work();
        this.bot = databaseSelector.bot;
        this.wishlistItems = databaseSelector.wishlistItems;
        this.working = databaseSelector.bot.worker;
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  protected handleMessage(taskName: string, message: string): void {
    this.logger.handleMessage(this.enumBot, taskName, message);
  }

  protected handleError(taskName: string, message: string): void {
    this.logger.handleError(this.enumBot, taskName, message);
  }
}
