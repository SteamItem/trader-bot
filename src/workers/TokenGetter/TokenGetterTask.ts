import { IBotParam } from '../../models/botParam';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class TokenGetterTask extends WorkerTask {
  taskName = "Token Getter";
  constructor(botParam: IBotParam) {
    super();
    this.$botParam = botParam;
  }
  private $botParam: IBotParam;
  public get botParam(): IBotParam {
    return this.$botParam;
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
