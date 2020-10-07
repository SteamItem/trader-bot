import cron = require('node-cron');
import { RollbitInventoryFilterer } from '../InventoryFilterer/RollbitInventoryFilterer';
import { RollbitWithdrawMakerTask } from '../WithdrawMaker/RollbitWithdrawMakerTask';
import { RollbitBase } from './RollbitBase';
import { EnumBot } from '../../helpers/enum';
import { IRollbitSocketItem, IRollbitSocketBalance } from '../../interfaces/rollbit';
import { IBot } from '../../models/bot';
import { RollbitApi } from '../../api/rollbit';
import { LoggerBase } from '../Logger/LoggerBase';
export class RollbitCsGoWorker extends RollbitBase {
  enumBot = EnumBot.RollbitCsGo;
  private balance: number;
  private api: RollbitApi;
  protected bot: IBot;

  constructor(api: RollbitApi, logger: LoggerBase) {
    super(logger);
    this.api = api;
  }

  start(bot: IBot): void {
    super.start(bot);
    this.bot = bot;
    this.inventoryGetter();
  }

  private inventoryGetter() {
    return cron.schedule('*/15 * * * * *', async () => {
      await this.api.csgoInventory(this.bot.cookie);
    });
  }

  async onSteamMarketItem(item: IRollbitSocketItem): Promise<void> {
    if (item.state === 'listed') {
      await this.inventoryOperation(item);
    }
  }

  private async inventoryOperation(item: IRollbitSocketItem) {
    let currentTask = "inventoryOperation";
    const newItemDate = new Date();
    try {
      const inventoryFilterer = new RollbitInventoryFilterer(this.balance, [item], this.wishlistItems);
      currentTask = inventoryFilterer.taskName;
      inventoryFilterer.filter();

      const withdrawMaker = new RollbitWithdrawMakerTask(this.api, this.bot, inventoryFilterer.itemsToBuy);
      currentTask = withdrawMaker.taskName;
      await withdrawMaker.work();

      const afterWithdrawDate = new Date();
      const totalTime = afterWithdrawDate.getTime() - newItemDate.getTime();

      withdrawMaker.successWithdrawResult.forEach(r => {
        this.handleMessage(currentTask, `${r.name} withdrawn for ${r.price} in ${totalTime} ms`);
      });
      withdrawMaker.failWithdrawResult.forEach(r => {
        this.handleError(currentTask, `${r.name} withdraw failed ${r.price} in ${totalTime} ms - ${r.message}`);
      });
    } catch (e) {
      this.handleError(currentTask, e.message);
    }
  }

  onBalance(socketBalance: IRollbitSocketBalance): void {
    this.balance = socketBalance.balance / 100;
    const type = socketBalance.type || "Initial"
    const message = `Current Balance: ${this.balance} - ${type}`;
    this.handleMessage("Balance", message);
  }
}
