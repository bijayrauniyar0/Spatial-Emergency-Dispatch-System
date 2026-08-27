// src/models/responderModels.ts
import { DataTypes, Model, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import User from './userModels';
import Station from './stationModels';

class Responder extends Model {
  public id!: number;
  public user_id!: ForeignKey<User['id']>;
  public station_id!: ForeignKey<Station['id']>;
  public status!: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  public location?: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  public location_updated_at?: Date | null;
  public created_at!: Date;
  public updated_at!: Date;
}

Responder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    status: {
      type: DataTypes.ENUM('AVAILABLE', 'BUSY', 'OFF_DUTY'),
      allowNull: false,
      defaultValue: 'AVAILABLE',
    },
    location: {
      type: DataTypes.GEOMETRY('Point', 4326),
      allowNull: true,
    },
    location_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'responders',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  },
);

User.hasMany(Responder, { foreignKey: 'user_id' });
Responder.belongsTo(User, { foreignKey: 'user_id' });

Station.hasMany(Responder, { foreignKey: 'station_id' });
Responder.belongsTo(Station, { foreignKey: 'station_id' });

export default Responder;
