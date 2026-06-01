// src/models/stationModels.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Station extends Model {
  public id!: number;
  public name!: string;
  public category!: 'POLICE' | 'FIRE' | 'MEDICAL';
  public location!: {
    type: 'Point';
    coordinates: [number, number];
  };
  public created_at!: Date;
  public updated_at!: Date;
}

Station.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    category: {
      type: DataTypes.ENUM('POLICE', 'FIRE', 'MEDICAL'),
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('Point', 4326),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'stations',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
  },
);

export default Station;
