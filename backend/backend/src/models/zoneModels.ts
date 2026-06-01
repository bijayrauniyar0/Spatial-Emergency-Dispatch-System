// src/models/zoneModels.ts
import { DataTypes, Model, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import Station from './stationModels';

class Zone extends Model {
  public id!: number;
  public station_id!: ForeignKey<Station['id']>;
  public boundary!: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  public created_at!: Date;
  public updated_at!: Date;
}

Zone.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    station_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Station,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    boundary: {
      type: DataTypes.GEOMETRY('Polygon', 4326),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'zones',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  },
);

Station.hasOne(Zone, { foreignKey: 'station_id' });
Zone.belongsTo(Station, { foreignKey: 'station_id' });

export default Zone;
