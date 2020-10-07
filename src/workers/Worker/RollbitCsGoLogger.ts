import db = require('../../db');
import { IRollbitHistory, IRollbitSocketItem, IRollbitSocketBalance } from '../../interfaces/rollbit';
import { RollbitBase } from './RollbitBase';
import _ = require('lodash');
import { EnumBot } from '../../helpers/enum';
export class RollbitCsGoLogger extends RollbitBase {
  bot = EnumBot.RollbitCsGoLogger;
  async onSteamMarketItem(item: IRollbitSocketItem): Promise<void> {
    const normalizedItem = this.normalizeItem(item);
    if (item.state === 'listed') {
      await this.saveListedItem(normalizedItem);
    }
    if (item.state === 'gone') {
      await this.saveGoneItem(normalizedItem);
    }
  }

  onBalance(socketBalance: IRollbitSocketBalance): void {
    console.log(socketBalance.balance / 100);
  }

  private normalizeItem(item: IRollbitSocketItem): IRollbitHistory {
    return {
      ref: item.ref,
      price: item.price,
      markup: item.markup,
      name: item.items.map(ii => ii.name).join("#"),
      weapon: item.items.map(ii => ii.weapon).join("#"),
      skin: item.items.map(ii => ii.skin).join("#"),
      rarity: item.items.map(ii => ii.rarity).join("#"),
      exterior: item.items.map(ii => ii.exterior).join("#"),
      baseprice: _.sumBy(item.items, ii => ii.price)
    };
  }

  private saveListedItem(item: IRollbitHistory) {
    item.listed_at = new Date();
    return db.updateRollbitHistoryListed(item);
  }

  private saveGoneItem(item: IRollbitHistory) {
    item.gone_at = new Date();
    return db.updateRollbitHistoryGone(item);
  }
}