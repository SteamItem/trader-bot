import _ = require('lodash');
import { IEmpireInstantInventoryItem } from '../../interfaces/csgoEmpire';
import { InventoryFiltererUnit } from './InventoryFiltererUnit';
export class EmpireInstantInventoryFilterer extends InventoryFiltererUnit<IEmpireInstantInventoryItem> {
  getItemName(inventoryItem: IEmpireInstantInventoryItem): string {
    return inventoryItem.market_name;
  }
  getItemPrice(inventoryItem: IEmpireInstantInventoryItem): number {
    return inventoryItem.market_value / 100;
  }
  isNewItemSuitable(inventoryItemToAdd: IEmpireInstantInventoryItem, currentlySelectedInventoryItems: IEmpireInstantInventoryItem[]): boolean {
    const maxItemPerBot = 20;
    const currentBotItems = _.filter(currentlySelectedInventoryItems, ii => ii.bot_id === inventoryItemToAdd.bot_id);
    return currentBotItems.length < maxItemPerBot;
  }
  afterFilterAction(inventoryItems: IEmpireInstantInventoryItem[]): IEmpireInstantInventoryItem[] {
    return _.shuffle(inventoryItems);
  }
}
