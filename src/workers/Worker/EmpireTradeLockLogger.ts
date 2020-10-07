import cron = require('node-cron');
import { WorkerBase } from "./WorkerBase";
import { TokenGetterTask } from '../TokenGetter/TokenGetterTask';
import { EmpireTokenGetterTask } from '../TokenGetter/EmpireTokenGetterTask';
import { InventoryGetterTask } from '../InventoryGetter/InventoryGetterTask';
import { IEmpireTradeLockInventoryItem, IEmpireTradeLockPrice, IEmpireTradeLockPriceChange } from '../../interfaces/csgoEmpire';
import { EnumBot } from '../../helpers/enum';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { EmpireDatabaseSelector } from '../DatabaseSelector/EmpireInstantDatabaseSelector';
import { EmpireTradeLockInventoryGetterTask } from '../InventoryGetter/EmpireTradeLockInventoryGetterTask';
import db = require('../../db');
import _ = require('lodash');
export class EmpireTradeLockLogger extends WorkerBase {
  protected token: string;
  protected inventoryItems: IEmpireTradeLockInventoryItem[] = [];
  protected balance: number;
  protected itemsToBuy: IEmpireTradeLockInventoryItem[] = [];
  private scheduledTasks: cron.ScheduledTask[] = [];
  private inventoryTimer: NodeJS.Timeout;
  private lastPrices: IEmpireTradeLockPrice[] = [];
  private currentPrices: IEmpireTradeLockPrice[] = [];
  private priceChanges: IEmpireTradeLockPriceChange[] = [];
  private newItems: IEmpireTradeLockPrice[] = [];

  bot = EnumBot.EmpireTradeLockLogger;
  getDatabaseSelector(): DatabaseSelectorTask {
    return new EmpireDatabaseSelector(EnumBot.EmpireTradeLockLogger);
  }
  getInventoryGetter(): InventoryGetterTask<IEmpireTradeLockInventoryItem> {
    return new EmpireTradeLockInventoryGetterTask(this.botParam);
  }
  getTokenGetter(): TokenGetterTask {
    return new EmpireTokenGetterTask(this.botParam);
  }
  start(): void {
    const tokenScheduler = this.tokenScheduler();
    const inventoryScheduler = this.inventoryScheduler();
    this.scheduledTasks = [tokenScheduler, inventoryScheduler];
    this.scheduledTasks.forEach(st => { st.start(); });
  }
  stop(): void {
    this.scheduledTasks.forEach(st => { st.stop(); });
    clearInterval(this.inventoryTimer);
  }
  private tokenScheduler() {
    return cron.schedule('*/30 * * * * *', async () => {
      let currentTask = "tokenScheduler";
      try {
        const tokenGetter = this.getTokenGetter();
        currentTask = tokenGetter.taskName;
        await tokenGetter.work();
        this.token = tokenGetter.token;
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  private inventoryScheduler() {
    return cron.schedule('* * * * *', async () => {
      let currentTask = "inventoryTask";
      try {
        this.lastPrices = await this.getLastPrices();
        const inventoryGetter = this.getInventoryGetter();
        currentTask = inventoryGetter.taskName;
        await inventoryGetter.work();
        this.inventoryItems = inventoryGetter.inventoryItems;
        this.currentPrices = this.generateCurrentPrices();
        this.priceChanges = this.generatePriceChanges();
        this.newItems = this.generateNewItems();
        this.logPriceChanges();
        this.logNewItems();
        await db.updateEmpireTradeLockLastPrices(this.currentPrices);
      } catch (e) {
        this.handleError(currentTask, e.message);
      }
    });
  }

  private getLastPrices() {
    return db.empireTradeLockLastPrices();
  }

  private generateCurrentPrices(): IEmpireTradeLockPrice[] {
    const groupedItems = _.groupBy(this.inventoryItems, i => i.market_name);
    const result: IEmpireTradeLockPrice[] = [];
    for (const market_name in groupedItems) {
      const market_value = _.minBy(groupedItems[market_name], i => i.market_value).market_value;
      result.push({market_name, market_value});
    }
    return result;
  }

  private generatePriceChanges(): IEmpireTradeLockPriceChange[] {
    const changes: IEmpireTradeLockPriceChange[] = [];
    this.currentPrices.forEach(cp => {
      const previousItem = _.find(this.lastPrices, p => p.market_name === cp.market_name);
      if (previousItem && Math.abs(previousItem.market_value - cp.market_value) > 0) {
        changes.push({name: cp.market_name, current_value: cp.market_value, previous_value: previousItem.market_value -1});
      }
    });
    return changes;
  }

  private generateNewItems(): IEmpireTradeLockPrice[] {
    const newItems: IEmpireTradeLockPrice[] = [];
    this.currentPrices.forEach(cp => {
      const previousItem = _.find(this.lastPrices, p => p.market_name === cp.market_name);
      if (!previousItem) {
        newItems.push(cp);
      }
    });
    return newItems;
  }

  private logPriceChanges(): void {
    this.priceChanges.forEach(pc => {
      const increased = pc.current_value > pc.previous_value;
      const direction = increased ? "Up" : "Down";
      const icon = increased ? "🔴" : "🟢";
      const priceChangeMessageParts = [`${icon} ${pc.name}`, `${pc.previous_value / 100} -> ${pc.current_value / 100}`];
      const priceChangeMessage = priceChangeMessageParts.join('\n');
      this.handleMessage(`Price ${direction}`, priceChangeMessage);
    });
  }

  private logNewItems(): void {
    this.newItems.forEach(ni => {
      const priceChangeMessage = `🔵 ${ni.market_name}: ${ni.market_value / 100}`;
      this.handleMessage("New Item", priceChangeMessage);
    });
  }
}