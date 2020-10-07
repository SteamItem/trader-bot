import cron = require('node-cron');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBotParam } from '../../models/botParam';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { LoggerBase } from '../Logger/LoggerBase';
import { EnumBot } from '../../helpers/enum';
export abstract class WorkerBase {
  constructor(logger: LoggerBase) {
    this.logger = logger;
  }

  protected logger: LoggerBase;
  protected botParam: IBotParam;
  protected wishlistItems: IWishlistItem[];
  private _working = false;
  private set working(value: boolean) {
    if (this._working === false && value === true) {
      this.start(this.botParam);
    }
    this._working = value;
  }

  abstract bot: EnumBot;
  abstract start(botParam: IBotParam): void;

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
        this.botParam = databaseSelector.botParam;
        this.wishlistItems = databaseSelector.wishlistItems;
        this.working = databaseSelector.botParam.worker;
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  protected handleMessage(taskName: string, message: string): void {
    this.logger.handleMessage(this.bot, taskName, message);
  }

  protected handleError(taskName: string, message: string): void {
    this.logger.handleError(this.bot, taskName, message);
  }
}
