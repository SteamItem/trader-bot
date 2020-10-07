import * as mongoose from 'mongoose';

export interface IWishlistItem {
  site_id: number;
  appid: number;
  name: string;
  max_price?: number;
}

interface IWishlistItemDocument extends IWishlistItem, mongoose.Document {}

const WishlistItemSchema: mongoose.Schema = new mongoose.Schema({
  site_id: { type: Number, required: true },
  appid: { type: Number, required: true },
  name: { type: String, required: true },
  max_price: { type: Number }
});

export default mongoose.model<IWishlistItemDocument>('WishlistItem', WishlistItemSchema);