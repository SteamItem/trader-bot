import _ = require('lodash');
import { IWishlistItem } from '../../models/wishlistItem';
import { WorkerUnit } from '../Common/WorkerUnit';
import helpers from '../../helpers';
export abstract class InventoryFiltererUnit<II> extends WorkerUnit {
  taskName = "Inventory Filterer";
  constructor(balance: number, inventoryItems: II[], wishlistItems: IWishlistItem[]) {
    super();
    this.$balance = balance;
    this.$inventoryItems = inventoryItems;
    this.$wishlistItems = wishlistItems;
  }
  private $balance: number;
  private $inventoryItems: II[];
  public get inventoryItems(): II[] {
    return this.$inventoryItems;
  }
  private $wishlistItems: IWishlistItem[];
  private $wishlistFilteredItems: II[];
  public get wishlistFilteredItems(): II[] {
    return this.$wishlistFilteredItems;
  }
  private $itemsToBuy: II[];
  public get itemsToBuy(): II[] {
    return this.$itemsToBuy;
  }
  public filter(): void {
    let itemsToBuy: II[] = [];
    itemsToBuy = this.filterForWishlist();
    this.$wishlistFilteredItems = itemsToBuy;
    itemsToBuy = this.afterFilterAction(itemsToBuy);
    itemsToBuy = this.filterForBalance(itemsToBuy);
    this.$itemsToBuy = itemsToBuy;
  }
  private filterForWishlist(): II[] {
    const itemsToBuy = [];
    this.$wishlistItems.forEach(wi => {
      const filterResult = _.filter(this.$inventoryItems, ii => {
        return this.checkForItemToBuy(ii, wi);
      });
      filterResult.forEach(r => itemsToBuy.push(r));
    });
    return itemsToBuy;
  }

  afterFilterAction(inventoryItems: II[]): II[] {
    return inventoryItems;
  }

  private filterForBalance(inventoryItems: II[]): II[] {
    const itemsToBuy: II[] = [];
    let currentBalance = this.$balance;
    inventoryItems.forEach(ii => {
      const itemPrice = this.getItemPrice(ii);
      if (itemPrice <= currentBalance) {
        const suitableFilter = this.isNewItemSuitable(ii, itemsToBuy);
        if (suitableFilter) {
          itemsToBuy.push(ii);
          currentBalance -= itemPrice;
        }
      }
    });
    return itemsToBuy;
  }

  private checkForItemToBuy(inventoryItem: II, wishlistItem: IWishlistItem): boolean {
    const itemName = this.getItemName(inventoryItem);
    const itemPrice = this.getItemPrice(inventoryItem)

    let filterResult = helpers.compareStrings(itemName, wishlistItem.name);
    if (wishlistItem.max_price) {
      filterResult = filterResult && itemPrice <= wishlistItem.max_price;
    }
    return filterResult;
  }

  abstract getItemName(inventoryItem: II): string;
  abstract getItemPrice(inventoryItem: II): number;
  isNewItemSuitable(_inventoryItemToAdd: II, _currentlySelectedInventoryItems: II[]): boolean {
    return true;
  }
}
