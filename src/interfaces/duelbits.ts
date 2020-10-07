export interface IDuelbitsSeller {
  online: boolean;
}

export interface IDuelbitsItem {
  suggestedPrice: number;
  assetid: string;
  price: number;
  appid: number;
  name: string;
  icon: string;
}

export interface IDuelbitsListing {
  seller: IDuelbitsSeller;
  sellTime: any;
  id: string;
  items: IDuelbitsItem[];
}

export interface IDuelbitsListingsResponse {
  success: boolean;
  listings: IDuelbitsListing[];
}

export interface IDuelbitsWebsocketPollingResponse {
  sid: string;
  upgrades: string[];
  pingInterval: number;
  pingTimeout: number;
}

export interface IDuelbitsInventory {
  tradable: number;
  market_name: string;
  assetid: string;
  appid: number;
  icon_large: string;
}

export interface IDuelbitsUserBase {
  muteUntil: number;
  wageredRouletteAffiliate: number;
  avatar: string;
  wageredSoftswiss: any;
  displayName: string;
  balance: number;
  wageredDuelAffiliate: number;
  wageredDuel: number;
  affiliation: string;
  wageredSoftswissAffiliate: any;
  suggestedName: string;
  rakeBackRevenue: number;
  id: string;
  authRole: number;
  usedCodes: any[];
  apiKey: string;
  tradeUrl: string;
  inventoryUpdated: number;
  wageredRoulette: number;
  loginType: string;
  verified: boolean;
  withdraw: number;
  shouldCheck: number;
  deposit: number;
  ethAddress: string;
  affiliateRevenue: number;
}

export interface IDuelbitsOnAuth extends IDuelbitsUserBase {
  inventory: IDuelbitsInventory[];
}

export type IDuelbitsOnUserUpdate = IDuelbitsUserBase

export interface IDuelbitsSeller {
  joinSteam: number;
  image: string;
  id: string;
  name: string;
}

export interface IDuelbitsItem {
  suggestedPrice: number;
  nameHash: string;
  appid: number;
  price: number;
  icon: string;
  assetid: string;
  name: string;
}

export interface IDuelbitsBuyer {
  id: string;
  joinSteam: number;
  name: string;
  tradeUrl: string;
  image: string;
}

export interface IDuelbitsWithdrawResponse {
  id: string;
  lastChecked: number;
  type: number;
  status: number;
  tradeOfferId?: any;
  sellTime: number;
  seller: IDuelbitsSeller;
  webhookEndpoint: string;
  items: IDuelbitsItem[];
  buyer: IDuelbitsBuyer;
  buyTime: number;
  pongExpiration: number;
}
