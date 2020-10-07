import botController = require('../../controllers/bot');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBot } from '../../models/bot';
import { WorkerTask } from '../Common/WorkerTask';
import { EnumBot } from '../../helpers/enum';
export abstract class DatabaseSelectorTask extends WorkerTask {
  taskName = "Database Selector";
  constructor(enumBot: EnumBot) {
    super();
    this.$enumBot = enumBot;
  }
  private $enumBot: EnumBot;
  private getEnumBot() {
    return botController.findOne(this.$enumBot);
  }
  private $bot: IBot;
  public get bot(): IBot {
    return this.$bot;
  }
  private $wishlistItems: IWishlistItem[];
  public get wishlistItems(): IWishlistItem[] {
    return this.$wishlistItems;
  }
  abstract getWishlistItems(): Promise<IWishlistItem[]>;
  async work(): Promise<void> {
    const botEnumBotPromise = this.getEnumBot();
    const wishlistItemsPromise = this.getWishlistItems();
    const result = await Promise.all([botEnumBotPromise, wishlistItemsPromise]);
    this.$bot = result[0];
    this.$wishlistItems = result[1];
  }
}
