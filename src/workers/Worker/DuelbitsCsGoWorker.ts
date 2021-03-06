import cron = require('node-cron');
import { EnumBot } from '../../helpers/enum';
import { IBot } from '../../models/bot';
import { DatabaseSelectorTask } from '../DatabaseSelector/DatabaseSelectorTask';
import { WorkerBase } from './WorkerBase';
import { LoggerBase } from '../Logger/LoggerBase';
import { DuelbitsCsGoDatabaseSelector } from '../DatabaseSelector/DuelbitsCsGoDatabaseSelector';
import { DuelbitsApi } from '../../api/duelbits';
import { DuelbitsInventoryFilterer } from '../InventoryFilterer/DuelbitsInventoryFilterer';
import { IDuelbitsOnAuth, IDuelbitsOnUserUpdate } from '../../interfaces/duelbits';
import { DuelbitsSocket } from '../../api/duelbitsSocket';
import { DuelbitsWithdrawMakerTask } from '../WithdrawMaker/DuelbitsWithdrawMakerTask';
export class DuelbitsCsGoWorker extends WorkerBase {
  enumBot = EnumBot.Duelbits;
  private balance: number;
  private tradeUrl: string;
  private api: DuelbitsApi;
  protected bot: IBot;

  constructor(botId: string, api: DuelbitsApi, logger: LoggerBase) {
    super(botId, logger);
    this.api = api;
  }

  private socket: DuelbitsSocket;
  private scheduledTasks: cron.ScheduledTask[] = [];
  start(bot: IBot): void {
    this.bot = bot;
    this.socket = new DuelbitsSocket();
    this.socket.connect().then(socket => {
      socket.emit('authenticate', bot.cookie, (data: IDuelbitsOnAuth) => {
        this.onAuth(data);
      });
      socket.on('user:update', (data: IDuelbitsOnUserUpdate) => {
        this.onUserUpdate(data);
      });
    })
    const inventoryScheduler = this.inventoryScheduler();
    this.scheduledTasks = [inventoryScheduler];
  }

  stop(): void {
    this.socket.disconnect();
    this.scheduledTasks.forEach(st => { st.stop(); });
  }

  getDatabaseSelector(): DatabaseSelectorTask {
    return new DuelbitsCsGoDatabaseSelector(this.botId);
  }

  private inventoryScheduler() {
    return cron.schedule('* * * * * *', async () => {
      try {
        const inventoryResponse = await this.api.csgoInventory();

        const inventoryFilterer = new DuelbitsInventoryFilterer(this.balance, inventoryResponse.listings, this.wishlistItems);
        inventoryFilterer.filter();

        const withdrawMaker = new DuelbitsWithdrawMakerTask(this.socket, this.tradeUrl, inventoryFilterer.itemsToBuy);
        await withdrawMaker.work();
      } catch (e) {
        this.handleError("Inventory Operation", e.message);
      }
    });
  }

  private onAuth(data: IDuelbitsOnAuth) {
    this.balance = data.balance / 100;
    this.tradeUrl = data.tradeUrl;
    const message = `Initial Balance: ${this.balance}`;
    this.handleMessage("Auth", message);
  }

  private onUserUpdate(data: IDuelbitsOnUserUpdate) {
    this.balance = data.balance / 100;
    this.tradeUrl = data.tradeUrl;
    const message = `Balance: ${this.balance}`;
    this.handleMessage("User Update", message);
  }
}