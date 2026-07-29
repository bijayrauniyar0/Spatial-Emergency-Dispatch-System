import { Request, Response } from 'express';
import sequelize from '../config/database';
import Incident from '../models/incidentModel';
import Station from '../models/stationModels';
import { createGuestUser } from '../services/guestService';
import { generateToken } from '../utils/jwtUtils';
import { NODE_ENV } from '../constants';

interface CreateIncidentRequest {
  category: 'POLICE' | 'FIRE' | 'MEDICAL';
  latitude: number;
  longitude: number;
}

export const createIncident = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, latitude, longitude } = req.body as CreateIncidentRequest;

    // Validation: required fields
    if (!category || latitude === undefined || longitude === undefined) {
      res.status(400).json({
        error: 'Missing required fields: category, latitude, longitude',
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

    // Validation: latitude/longitude in range
    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({
        error: 'Latitude and longitude must be valid numeric values',
      });
      return;
    }

    if (latitude < -90 || latitude > 90) {
      res.status(400).json({
        error: 'Latitude must be between -90 and 90',
      });
      return;
    }

    if (longitude < -180 || longitude > 180) {
      res.status(400).json({
        error: 'Longitude must be between -180 and 180',
      });
      return;
    }

    let citizen = req.user;

    // If no user, auto-create a guest user and set the auth cookie
    if (!citizen) {
      citizen = await createGuestUser();
      const token = generateToken(
        { id: citizen.id, email: citizen.email, role: citizen.role },
        '86h',
      );
      res.cookie('token', token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    // Find the station: first try zone containment, then fall back to nearest
    let stationId: number | null = null;

    // Query 1: Find station by zone containment
    const [zoneResult] = await sequelize.query(
      `SELECT s.id AS station_id FROM zones z
       JOIN stations s ON s.id = z.station_id
       WHERE s.category = :category
         AND ST_Contains(z.boundary, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326))
       LIMIT 1`,
      {
        replacements: { category, lng: longitude, lat: latitude },
        type: sequelize.QueryTypes.SELECT as any,
      },
    );

    if (zoneResult && (zoneResult as any).station_id) {
      stationId = (zoneResult as any).station_id;
    } else {
      // Query 2: Fall back to nearest station by distance
      const [nearestResult] = await sequelize.query(
        `SELECT s.id AS station_id FROM stations s
         WHERE s.category = :category
         ORDER BY ST_Distance(s.location::geography, ST_SetSRID(ST_MakePoint(:lng,:lat),4326)::geography) ASC
         LIMIT 1`,
        {
          replacements: { category, lng: longitude, lat: latitude },
          type: sequelize.QueryTypes.SELECT as any,
        },
      );

      if (nearestResult && (nearestResult as any).station_id) {
        stationId = (nearestResult as any).station_id;
      }
    }

    if (!stationId) {
      res.status(404).json({
        error: `No station found for category ${category}`,
      });
      return;
    }

    // Create the incident
    const incident = await Incident.create({
      citizen_id: citizen.id,
      station_id: stationId,
      category,
      status: 'PENDING',
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    // Fetch incident with station details
    const incidentWithStation = await Incident.findByPk(incident.id, {
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
      ],
    });

    res.status(201).json({
      message: 'Incident created successfully',
      data: incidentWithStation,
    });
  } catch (error) {
    console.error('Error creating incident:', error);

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

export const getActiveIncident = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // If not authenticated, return null data (no error, just empty)
    if (!req.user) {
      res.status(200).json({
        message: 'No active incident',
        data: null,
      });
      return;
    }

    // Find the most recent active incident for this citizen
    const incident = await Incident.findOne({
      where: {
        citizen_id: req.user.id,
        status: ['PENDING', 'RESPONDING'],
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
      ],
    });

    res.status(200).json({
      message: 'Active incident retrieved',
      data: incident,
    });
  } catch (error) {
    console.error('Error fetching active incident:', error);

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
