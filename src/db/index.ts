import { Sequelize, Model, DataTypes, Association } from 'sequelize';
import R = require('ramda');
import config = require('../config');
import { IRollbitHistory } from '../interfaces/rollbit';
import { IEmpireTradeLockPrice } from '../interfaces/csgoEmpire';

const sequelize = new Sequelize(config.RDB_URL, {dialect: "postgres"});


class PricEmpireItem extends Model {
  public id!: number;
  public market_hash_name!: string;
  public image!: string;
  public app_id!: number;
  public last_price!: number;
  public skin!: string;
  public family!: string;
  public exterior!: string;
  public created_at!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associations: {
    prices: Association<PricEmpireItem, PricEmpireItemPrice>;
  };
}

PricEmpireItem.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true
  },
  market_hash_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  app_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  last_price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  skin: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  family: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  exterior: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "pricempire_items"
});

class PricEmpireItemPrice extends Model {
  public id!: number;
  public item_id!: number;
  public price!: number;
  public source!: string;
  public created_at!: Date;
}

PricEmpireItemPrice.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true
  },
  item_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  source: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  tableName: "pricempire_itemprices"
})

PricEmpireItem.hasMany(PricEmpireItemPrice, {
  sourceKey: 'id',
  foreignKey: 'item_id',
  as: 'prices'
});
PricEmpireItemPrice.belongsTo(PricEmpireItem, {targetKey: 'id'});

class RollbitHistory extends Model {
  public ref!: string;
  public price!: number;
  public markup!: number;
  public name!: string;
  public weapon!: string;
  public skin!: string;
  public rarity!: string;
  public exterior!: string;
  public baseprice!: number;
  public listed_at!: Date | null;
  public gone_at!: Date | null;
}

RollbitHistory.init({
  ref: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  markup: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  weapon: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  skin: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  rarity: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  exterior: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  baseprice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  listed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  gone_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: "rollbithistories"
})

class RollbitFav extends Model {
  public name!: string;
}

RollbitFav.init({
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  }
}, {
  sequelize,
  tableName: "rollbitfavs"
})

class AgentStatus extends Model {
  public source: string;
  public createSocketCount: number;
  public createSocketErrorCount: number;
  public closeSocketCount: number;
  public errorSocketCount: number;
  public timeoutSocketCount: number;
  public requestCount: number;
  public freeSockets: string;
  public sockets: string;
  public requests: string;
}

AgentStatus.init({
  source: DataTypes.STRING(200),
  createSocketCount: DataTypes.INTEGER,
  createSocketErrorCount: DataTypes.INTEGER,
  closeSocketCount: DataTypes.INTEGER,
  errorSocketCount: DataTypes.INTEGER,
  timeoutSocketCount: DataTypes.INTEGER,
  requestCount: DataTypes.INTEGER,
  freeSockets: DataTypes.STRING(1000),
  sockets: DataTypes.STRING(1000),
  requests: DataTypes.STRING(1000),
}, {
  sequelize,
  tableName: "agentstatuses"
})

class InventoryOperationTiming extends Model {
  public source: string;
  public name: string;
  public price: number;
  public filterTime: number;
  public withdrawTime: number;
  public successWithdrawCount: number;
  public failWithdrawCount: number;
}

InventoryOperationTiming.init({
  source: DataTypes.STRING(200),
  name: DataTypes.STRING(200),
  price: DataTypes.DECIMAL(18, 2),
  filterTime: DataTypes.INTEGER,
  withdrawTime: DataTypes.INTEGER,
  successWithdrawCount: DataTypes.INTEGER,
  failWithdrawCount: DataTypes.INTEGER
}, {
  sequelize,
  tableName: "InventoryOperationTimings"
})

class EmpireTradeLockLastPrice extends Model {
  public market_name: string;
  public market_value: number;
}

EmpireTradeLockLastPrice.init({
  market_name: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  market_value: DataTypes.DECIMAL(18, 2),
}, {
  sequelize,
  tableName: "EmpireTradeLockLastPrices"
})

function sync(): Promise<Sequelize> {
  return sequelize.sync();
}

function updateRollbitHistoryListed(item: IRollbitHistory): Promise<boolean> {
  return RollbitHistory.upsert(item, {fields: ['ref','price','markup','name','weapon','skin','rarity','exterior','baseprice','listed_at']})
}

function updateRollbitHistoryGone(item: IRollbitHistory): Promise<boolean> {
  return RollbitHistory.upsert(item, {fields: ['ref','price','markup','name','weapon','skin','rarity','exterior','baseprice','gone_at']})
}

function rollbitHistories(): Promise<RollbitHistory[]> {
  return RollbitHistory.findAll();
}

function rollbitFavs(): Promise<RollbitFav[]> {
  return RollbitFav.findAll();
}

function rollbitFavAdd(name: string): Promise<RollbitFav> {
  return RollbitFav.create({ name: name });
}

function rollbitFavRemove(name: string): Promise<number> {
  return RollbitFav.destroy({where: { name: name }})
}

function empireTradeLockLastPrices(): Promise<EmpireTradeLockLastPrice[]> {
  return EmpireTradeLockLastPrice.findAll();
}

function updateEmpireTradeLockLastPrices(items: IEmpireTradeLockPrice[]): Promise<EmpireTradeLockLastPrice[]> {
  return EmpireTradeLockLastPrice.bulkCreate(items, {updateOnDuplicate: ['market_value']});
}

export = {
  sync,
  updateRollbitHistoryListed,
  updateRollbitHistoryGone,
  rollbitHistories,
  rollbitFavs,
  rollbitFavAdd,
  rollbitFavRemove,
  empireTradeLockLastPrices,
  updateEmpireTradeLockLastPrices
}