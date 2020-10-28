import { Sequelize, Model, DataTypes, Association } from 'sequelize';
import R = require('ramda');
import config = require('../config');
import { IRollbitHistory } from '../interfaces/rollbit';

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

function sync(): Promise<Sequelize> {
  return sequelize.sync();
}

function updateRollbitHistoryListed(item: IRollbitHistory): Promise<boolean> {
  return RollbitHistory.upsert(item, {fields: ['ref','price','markup','name','weapon','skin','rarity','exterior','baseprice','listed_at']})
}

function updateRollbitHistoryGone(item: IRollbitHistory): Promise<boolean> {
  return RollbitHistory.upsert(item, {fields: ['ref','price','markup','name','weapon','skin','rarity','exterior','baseprice','gone_at']})
}

export = {
  sync,
  updateRollbitHistoryListed,
  updateRollbitHistoryGone
}