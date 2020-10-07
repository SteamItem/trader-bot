import { IBot } from '../../models/bot';
import { IRollbitInventoryItem } from '../../interfaces/rollbit';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import { RollbitApi } from '../../api/rollbit';
export class RollbitWithdrawMakerTask<II extends IRollbitInventoryItem> extends WithdrawMakerTask<II> {
  constructor(api: RollbitApi, bot: IBot, itemsToBuy: II[]) {
    super(itemsToBuy);
    this.$api = api;
    this.$bot = bot;
  }
  private $api: RollbitApi;
  private $bot: IBot;

  async withdrawAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    this.inventoryItemsToBuy.forEach(ib => promises.push(this.withdraw(ib)));
    await Promise.all(promises);
  }

  private async withdraw(ib: IRollbitInventoryItem): Promise<void> {
    const itemName = ib.items.map(ii => ii.name).join("#");
    try {
      await this.$api.withdraw(this.$bot.cookie, [ib.ref]);
      this.$successWithdrawResult.push({name: itemName, price: ib.price});
    } catch (e) {
      this.$failWithdrawResult.push({name: itemName, price: ib.price, message: e.message})
    }
  }
}
