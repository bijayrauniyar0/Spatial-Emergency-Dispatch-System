// src/models/incidentModel.ts
import { DataTypes, Model, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import User from './userModels';
import Station from './stationModels';
import Responder from './responderModels';

class Incident extends Model {
  public id!: number;
  public citizen_id!: ForeignKey<User['id']>;
  public station_id!: ForeignKey<Station['id']>;
  public responder_id!: ForeignKey<Responder['id']> | null;
  public category!: 'POLICE' | 'FIRE' | 'MEDICAL';
  public status!: 'PENDING' | 'RESPONDING' | 'RESOLVED';
  public location!: {
    type: 'Point';
    coordinates: [number, number];
  };
  public created_at!: Date;
  public updated_at!: Date;
}

Incident.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    citizen_id: {
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
    responder_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Responder,
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    category: {
      type: DataTypes.ENUM('POLICE', 'FIRE', 'MEDICAL'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'RESPONDING', 'RESOLVED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    location: {
      type: DataTypes.GEOMETRY('Point', 4326),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'incidents',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  },
);

User.hasMany(Incident, { foreignKey: 'citizen_id', as: 'citizenIncidents' });
Incident.belongsTo(User, { foreignKey: 'citizen_id', as: 'citizen' });

Station.hasMany(Incident, { foreignKey: 'station_id' });
Incident.belongsTo(Station, { foreignKey: 'station_id' });

Responder.hasMany(Incident, { foreignKey: 'responder_id' });
Incident.belongsTo(Responder, { foreignKey: 'responder_id' });

export default Incident;
