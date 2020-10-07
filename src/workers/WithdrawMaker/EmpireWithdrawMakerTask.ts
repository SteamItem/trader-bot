import { IBotParam } from '../../models/botParam';
import { IEmpireInstantInventoryItem } from '../../interfaces/csgoEmpire';
import { WithdrawMakerTask } from './WithdrawMakerTask';
import _ = require('lodash');
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireWithdrawMakerTask extends WithdrawMakerTask<IEmpireInstantInventoryItem> {
  constructor(token: string, botParam: IBotParam, itemsToBuy: IEmpireInstantInventoryItem[]) {
    super(itemsToBuy);
    this.token = token;
    this.botParam = botParam;
  }
  private botParam: IBotParam;
  private token: string;

  async withdrawAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    const groupedItems = _.groupBy(this.inventoryItemsToBuy, i => i.bot_id);

    for (const key in groupedItems) {
      const item_ids = _.map(groupedItems[key], i => i.id);
      const promise = this.withdraw(parseInt(key), item_ids);
      promises.push(promise);
    }
    await Promise.all(promises);
  }

  private async withdraw(bot_id: number, item_ids: string[]): Promise<void> {
    const itemCount = item_ids.length;
    try {
      const api = new CSGOEmpireApi();
      await api.withdraw(this.botParam.cookie, this.token, bot_id, item_ids);
      this.successWithdrawResult.push({name: `${itemCount} Items`, price: 0})
    } catch (e) {
      this.failWithdrawResult.push({name: `${itemCount} Items`, price: 0, message: e.message});
    }
  }
}
