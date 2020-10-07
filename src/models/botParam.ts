import * as mongoose from 'mongoose';

export interface IBotParam {
  id: number;
  name: string;
  period: number;
  worker: boolean;
  cookie: string;
  code?: string;
}

export interface IBotParamDocument extends mongoose.Document, IBotParam {
  id: number;
}

const BotParamSchema: mongoose.Schema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  period: { type: Number, required: true },
  worker: { type: Boolean, required: true },
  cookie: { type: String, required: true },
  code: { type: String, required: false }
});

export default mongoose.model<IBotParamDocument>('BotParam', BotParamSchema);