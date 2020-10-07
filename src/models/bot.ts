import * as mongoose from 'mongoose';

export interface IBot {
  type: number;
  worker: boolean;
  cookie: string;
  code?: string;
}

export interface IBotDocument extends mongoose.Document, IBot {}

const BotSchema: mongoose.Schema = new mongoose.Schema({
  type: { type: Number, required: true },
  worker: { type: Boolean, required: true },
  cookie: { type: String, required: true },
  code: { type: String, required: false }
});

export default mongoose.model<IBotDocument>('Bot', BotSchema);