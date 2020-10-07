export interface IRollbitHistory {
  ref: string;
  price: number;
  markup: number;
  name: string;
  weapon: string;
  skin: string;
  rarity: string;
  exterior: string;
  baseprice: number;
  listed_at?: Date;
  gone_at?: Date;
}

export interface IRollbitHistoryView {
  name: string,
  price: number;
  markup: number;
  baseprice: number;
  listed_at?: Date;
  gone_at?: Date;
  fav: boolean
}

export interface IRollbitSocketBalance {
  balance: number;
  spent: number;
  deposited: number;
  withdrawn?: number;
  type?: string;
}

export interface IRollbitItem {
  name: string;
  image: string;
  classid: any;
  instanceid: number;
  weapon: string;
  skin: string;
  rarity: string;
  exterior: string;
  price: number;
  markup: number;
}

export interface IRollbitInventoryItem {
  ref: string;
  price: number;
  markup: number;
  items: IRollbitItem[];
}

export interface IRollbitInventoryItems {
  items: IRollbitInventoryItem[];
}

export interface IRollbitSocketItem extends IRollbitInventoryItem {
  state: string;
}