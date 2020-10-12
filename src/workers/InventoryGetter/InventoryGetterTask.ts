import { IBot } from '../../models/bot';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class InventoryGetterTask<SI> extends WorkerTask {
  constructor(bot: IBot) {
    super();
    this.$bot = bot;
  }
  private $bot: IBot;
  public get bot(): IBot {
    return this.$bot;
  }
  private $storeItems: SI[] = [];
  public get inventoryItems(): SI[] {
    return this.$storeItems;
  }
  async work(): Promise<void> {
    this.$storeItems = await this.getStoreItems();
  }
  abstract getStoreItems(): Promise<SI[]>;
}
