import { IBotParam } from '../../models/botParam';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class InventoryGetterTask<SI> extends WorkerTask {
  taskName = "Inventory Getter";
  constructor(botParam: IBotParam) {
    super();
    this.$botParam = botParam;
  }
  private $botParam: IBotParam;
  public get botParam(): IBotParam {
    return this.$botParam;
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
