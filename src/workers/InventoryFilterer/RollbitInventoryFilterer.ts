import { IRollbitInventoryItem } from '../../interfaces/rollbit';
import { InventoryFiltererUnit } from './InventoryFiltererUnit';
export class RollbitInventoryFilterer extends InventoryFiltererUnit<IRollbitInventoryItem> {
  getItemName(inventoryItem: IRollbitInventoryItem): string {
    return inventoryItem.items.map(ii => ii.name).join("#");
  }
  getItemPrice(inventoryItem: IRollbitInventoryItem): number {
    return inventoryItem.price;
  }

  isNewItemSuitable(inventoryItemToAdd: IRollbitInventoryItem) {
    return inventoryItemToAdd.markup <= 0;
  }
}