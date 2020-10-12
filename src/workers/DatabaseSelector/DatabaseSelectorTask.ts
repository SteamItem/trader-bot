import botController = require('../../controllers/bot');
import { IWishlistItem } from '../../models/wishlistItem';
import { IBot } from '../../models/bot';
import { WorkerTask } from '../Common/WorkerTask';
export abstract class DatabaseSelectorTask extends WorkerTask {
  constructor(botId: string) {
    super();
    this.$botId = botId;
  }
  private $botId: string;
  private getEnumBot() {
    return botController.findById(this.$botId);
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
