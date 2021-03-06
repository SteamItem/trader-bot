import cron = require('node-cron');
import { EmpireInstantInventoryFilterer } from '../InventoryFilterer/EmpireInventoryFilterer';
import { WorkerBase } from "./WorkerBase";
import { BalanceCheckerTask } from '../BalanceChecker/BalanceCheckerTask';
import { EmpireBalanceCheckerTask } from '../BalanceChecker/EmpireBalanceCheckerTask';
import { InventoryFiltererUnit } from '../InventoryFilterer/InventoryFiltererUnit';
import { TokenGetterTask } from '../TokenGetter/TokenGetterTask';
import { EmpireTokenGetterTask } from '../TokenGetter/EmpireTokenGetterTask';
import { WithdrawMakerTask } from '../WithdrawMaker/WithdrawMakerTask';
import { EmpireWithdrawMakerTask } from '../WithdrawMaker/EmpireWithdrawMakerTask';
import { InventoryGetterTask } from '../InventoryGetter/InventoryGetterTask';
import { IEmpireInstantInventoryItem } from '../../interfaces/csgoEmpire';
import { EnumBot } from '../../helpers/enum';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { EmpireInstantInventoryGetterTask } from '../InventoryGetter/EmpireInstantInventoryGetterTask';
import { EmpireDatabaseSelector } from '../DatabaseSelector/EmpireInstantDatabaseSelector';
export class EmpireInstantWorker extends WorkerBase {
  protected token: string;
  protected inventoryItems: IEmpireInstantInventoryItem[] = [];
  protected balance: number;
  protected itemsToBuy: IEmpireInstantInventoryItem[] = [];
  private scheduledTasks: cron.ScheduledTask[] = [];
  private inventoryTimer: NodeJS.Timeout;

  enumBot = EnumBot.CsGoEmpire;
  getDatabaseSelector(): DatabaseSelectorTask {
    return new EmpireDatabaseSelector(this.botId);
  }
  getInventoryGetter(): InventoryGetterTask<IEmpireInstantInventoryItem> {
    return new EmpireInstantInventoryGetterTask(this.bot);
  }
  getBalanceChecker(): BalanceCheckerTask {
    return new EmpireBalanceCheckerTask(this.bot);
  }
  getInventoryFilterer(): InventoryFiltererUnit<IEmpireInstantInventoryItem> {
    return new EmpireInstantInventoryFilterer(this.balance, this.inventoryItems, this.wishlistItems);
  }
  getTokenGetter(): TokenGetterTask {
    return new EmpireTokenGetterTask(this.bot);
  }
  getWithdrawMaker(): WithdrawMakerTask<IEmpireInstantInventoryItem> {
    return new EmpireWithdrawMakerTask(this.token, this.bot, this.itemsToBuy);
  }
  start(): void {
    const tokenScheduler = this.tokenScheduler();
    const balanceChecker = this.balanceChecker();
    this.scheduledTasks = [tokenScheduler, balanceChecker];
    this.scheduledTasks.forEach(st => { st.start(); });
    this.inventoryTimer = setInterval(() => {
      this.inventoryTask();
    }, 250);
  }
  stop(): void {
    this.scheduledTasks.forEach(st => { st.stop(); });
    clearInterval(this.inventoryTimer);
  }
  private tokenScheduler() {
    return cron.schedule('* * * * * *', async () => {
      try {
        const tokenGetter = this.getTokenGetter();
        await tokenGetter.work();
        this.token = tokenGetter.token;
      } catch (e) {
        this.handleError("Token Scheduler", e.message);
      }
    });
  }

  balanceChecker(): cron.ScheduledTask {
    return cron.schedule('* * * * * *', async () => {
      try {
        const balanceChecker = this.getBalanceChecker();
        await balanceChecker.work();
        this.balance = balanceChecker.balance;
      } catch (e) {
        this.handleError("Balance Checker", e.message);
      }
    });
  }

  private async inventoryTask() {
    try {
      const inventoryGetter = this.getInventoryGetter();
      await inventoryGetter.work();
      this.inventoryItems = inventoryGetter.inventoryItems;
      const inventoryFilterer = this.getInventoryFilterer();
      inventoryFilterer.filter();
      this.itemsToBuy = inventoryFilterer.itemsToBuy;
      const withdrawMaker = this.getWithdrawMaker();
      await withdrawMaker.work();
    } catch (e) {
      this.handleError("Inventory Task", e.message);
    }
  }
}
