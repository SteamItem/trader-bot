import { IWishlistItem } from '../../models/wishlistItem';
import { EnumSteamApp, EnumSite } from '../../helpers/enum';
import WishlistItem = require('../../models/wishlistItem');
import { DatabaseSelectorTask } from "./DatabaseSelectorTask";
export class EmpireDatabaseSelector extends DatabaseSelectorTask {
  async getWishlistItems(): Promise<IWishlistItem[]> {
    return WishlistItem.default.find({ site_id: EnumSite.CsGoEmpire, appid: EnumSteamApp.CsGo }).exec();
  }
}
