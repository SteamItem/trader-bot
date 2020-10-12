import { IBot } from '../../models/bot';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class TokenGetterTask extends WorkerTask {
  constructor(bot: IBot) {
    super();
    this.$bot = bot;
  }
  private $bot: IBot;
  public get bot(): IBot {
    return this.$bot;
  }
  private $token: string;
  public get token(): string {
    return this.$token;
  }
  async work(): Promise<void> {
    this.$token = await this.getToken();
  }
  abstract getToken(): Promise<string>;
}
