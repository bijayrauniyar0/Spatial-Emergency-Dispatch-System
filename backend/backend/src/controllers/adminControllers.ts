// src/controllers/adminControllers.ts
import { Request, Response } from 'express';
import sequelize from '../config/database';
import Station from '../models/stationModels';
import Zone from '../models/zoneModels';

interface CreateStationRequest {
  name: string;
  category: 'POLICE' | 'FIRE' | 'MEDICAL';
  latitude: number | string;
  longitude: number | string;
  zoneGeoJson: Record<string, any>;
}

export const getStations = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stations = await Station.findAll({
      raw: true,
    });

    const formattedStations = stations.map((station: any) => ({
      id: station.id,
      name: station.name,
      category: station.category,
      latitude: station.location?.coordinates?.[1],
      longitude: station.location?.coordinates?.[0],
      created_at: station.created_at,
      updated_at: station.updated_at,
    }));

    res.status(200).json({
      message: 'Stations retrieved successfully',
      data: formattedStations,
    });
  } catch (error) {
    console.error('Error fetching stations:', error);

    if (error instanceof Error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};

export const getStationsGeoJSON = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { categories } = req.query;

    let where = {};
    if (categories && typeof categories === 'string' && categories.length > 0) {
      const categoryList = categories.split(',').map((c) => c.trim());
      if (categoryList.length > 0) {
        where = { category: categoryList };
      }
    }

    const stations = await Station.findAll({
      where,
      raw: true,
    });

    const features = stations.map((station: any) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          station.location?.coordinates?.[0],
          station.location?.coordinates?.[1],
        ],
      },
      properties: {
        id: station.id,
        name: station.name,
        category: station.category,
        created_at: station.created_at,
        updated_at: station.updated_at,
      },
    }));

    res.status(200).json({
      type: 'FeatureCollection',
      features,
    });
  } catch (error) {
    console.error('Error fetching stations GeoJSON:', error);

    if (error instanceof Error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};

export const getZonesGeoJSON = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { categories } = req.query;

    let where = {};
    if (categories && typeof categories === 'string' && categories.length > 0) {
      const categoryList = categories.split(',').map((c) => c.trim());
      if (categoryList.length > 0) {
        where = { category: categoryList };
      }
    }

    const zones = await Zone.findAll({
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
          where,
        },
      ],
      raw: false,
    });

    const features = zones.map((zone: any) => {
      const station = zone.Station;
      return {
        type: 'Feature',
        geometry: zone.boundary,
        properties: {
          id: zone.id,
          station_id: zone.station_id,
          name: station?.name || 'Unknown',
          category: station?.category || 'UNKNOWN',
          created_at: zone.created_at,
          updated_at: zone.updated_at,
        },
      };
    });

    res.status(200).json({
      type: 'FeatureCollection',
      features,
    });
  } catch (error) {
    console.error('Error fetching zones GeoJSON:', error);

    if (error instanceof Error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};

export const createStation = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, category, latitude, longitude, zoneGeoJson } =
      req.body as CreateStationRequest;

    // Validation: required fields
    if (!name || !category || latitude === undefined || longitude === undefined || !zoneGeoJson) {
      res.status(400).json({
        error: 'Missing required fields: name, category, latitude, longitude, zoneGeoJson',
      });
      return;
    }

    // Validation: category enum
    if (!['POLICE', 'FIRE', 'MEDICAL'].includes(category)) {
      res.status(400).json({
        error: 'Invalid category. Must be one of: POLICE, FIRE, MEDICAL',
      });
      return;
    }

    // Parse and validate latitude/longitude
    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({
        error: 'Latitude and longitude must be valid numeric values',
      });
      return;
    }

    if (lat < -90 || lat > 90) {
      res.status(400).json({
        error: 'Latitude must be between -90 and 90',
      });
      return;
    }

    if (lng < -180 || lng > 180) {
      res.status(400).json({
        error: 'Longitude must be between -180 and 180',
      });
      return;
    }

    // Validation: GeoJSON structure
    if (!zoneGeoJson.type || zoneGeoJson.type !== 'Polygon') {
      res.status(400).json({
        error: 'zoneGeoJson must be a valid GeoJSON Polygon',
      });
      return;
    }

    if (!Array.isArray(zoneGeoJson.coordinates) || zoneGeoJson.coordinates.length === 0) {
      res.status(400).json({
        error: 'zoneGeoJson Polygon coordinates are invalid',
      });
      return;
    }

    // Atomic transaction
    const transaction = await sequelize.transaction();

    try {
      // Task 1: Create Station with PostGIS Point
      const station = await Station.create(
        {
          name: name.trim(),
          category,
          location: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        },
        { transaction },
      );

      // Task 2: Create Zone with PostGIS Polygon using raw SQL geometry constructor
      const zone = await Zone.create(
        {
          station_id: station.id,
          boundary: sequelize.fn('ST_GeomFromGeoJSON', JSON.stringify(zoneGeoJson)) as any,
        },
        { transaction, raw: true },
      );

      // Ensure SRID 4326 is set
      await sequelize.query(
        `UPDATE zones SET boundary = ST_SetSRID(boundary, 4326) WHERE id = ?`,
        {
          replacements: [zone.id],
          transaction,
        },
      );

      await transaction.commit();

      res.status(201).json({
        message: 'Station and zone created successfully',
        data: {
          station: {
            id: station.id,
            name: station.name,
            category: station.category,
            location: station.location,
          },
          zone: {
            id: zone.id,
            station_id: zone.station_id,
          },
        },
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating station:', error);

    if (error instanceof Error) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
};
