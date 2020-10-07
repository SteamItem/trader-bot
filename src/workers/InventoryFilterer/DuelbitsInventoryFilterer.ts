import { InventoryFiltererUnit } from './InventoryFiltererUnit';
import { IDuelbitsListing } from '../../interfaces/duelbits';
import _ = require('lodash');
export class DuelbitsInventoryFilterer extends InventoryFiltererUnit<IDuelbitsListing> {
  getItemName(inventoryItem: IDuelbitsListing): string {
    return inventoryItem.items.map(ii => ii.name).join("#");
  }
  getItemPrice(inventoryItem: IDuelbitsListing): number {
    return _.sumBy(inventoryItem.items, i => i.price) / 100;
  }

  getItemSuggestedPrice(inventoryItem: IDuelbitsListing): number {
    return _.sumBy(inventoryItem.items, i => i.suggestedPrice) / 100;
  }

  isNewItemSuitable(inventoryItemToAdd: IDuelbitsListing): boolean {
    // const diffPrice =  this.getItemPrice(inventoryItemToAdd) - this.getItemSuggestedPrice(inventoryItemToAdd);
    // return diffPrice < 1e-2;
    return true;
  }
}