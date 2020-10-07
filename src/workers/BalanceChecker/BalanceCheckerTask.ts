import { IBot } from '../../models/bot';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class BalanceCheckerTask extends WorkerTask {
  taskName = "Balance Checker";
  constructor(bot: IBot) {
    super();
    this.$bot = bot;
  }
  private $bot: IBot;
  public get bot(): IBot {
    return this.$bot;
  }
  private $balance: number;
  public get balance(): number {
    return this.$balance;
  }
  async work(): Promise<void> {
    this.$balance = await this.getBalance();
  }
  abstract getBalance(): Promise<number>;
}
