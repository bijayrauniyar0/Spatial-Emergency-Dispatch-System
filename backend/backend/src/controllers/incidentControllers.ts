import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import Incident from '../models/incidentModel';
import Station from '../models/stationModels';
import Responder from '../models/responderModels';
import User from '../models/userModels';
import { createGuestUser } from '../services/guestService';
import { publishCitizenIncidentUpdate } from '../services/sseService';
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
        type: QueryTypes.SELECT as any,
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
          type: QueryTypes.SELECT as any,
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

    // Notify responders at the station about the new incident
    const { publishStationIncidentUpdate } = await import('../services/sseService');
    publishStationIncidentUpdate(stationId, {
      type: 'incident_created',
      incidentId: incident.id,
      category,
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
        status: ['PENDING', 'RESPONDING', 'ARRIVED'],
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
        {
          model: Responder,
          attributes: ['id', 'status'],
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'number'],
            },
          ],
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

export const getStationQueue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Find responder for current user
    const responder = await Responder.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Station, attributes: ['id', 'name', 'category'] }],
    });

    if (!responder) {
      res.status(404).json({
        error: 'Responder profile not found. Please contact admin.',
      });
      return;
    }

    // Get all pending incidents for this station
    const incidents = await Incident.findAll({
      where: {
        station_id: responder.station_id,
        status: 'PENDING',
      },
      order: [['created_at', 'ASC']],
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
      ],
    });

    res.status(200).json({
      message: 'Station queue retrieved',
      data: incidents,
    });
  } catch (error) {
    console.error('Error fetching station queue:', error);

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

export const getMyTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Find responder for current user
    const responder = await Responder.findOne({
      where: { user_id: req.user.id },
    });

    if (!responder) {
      res.status(404).json({
        error: 'Responder profile not found. Please contact admin.',
      });
      return;
    }

    // Get current active task (RESPONDING or ARRIVED)
    const incident = await Incident.findOne({
      where: {
        responder_id: responder.id,
        status: ['RESPONDING', 'ARRIVED'],
      },
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
        {
          model: User,
          as: 'citizen',
          attributes: ['id', 'name', 'email', 'number', 'oauth_provider'],
        },
      ],
    });

    res.status(200).json({
      message: 'Current task retrieved',
      data: incident,
    });
  } catch (error) {
    console.error('Error fetching current task:', error);

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

export const claimIncident = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find responder for current user
    const responder = await Responder.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Station, attributes: ['id', 'name', 'category'] }],
    });

    if (!responder) {
      res.status(404).json({
        error: 'Responder profile not found. Please contact admin.',
      });
      return;
    }

    // Use transaction with row lock to prevent double-claim race
    const transaction = await sequelize.transaction();

    try {
      // Fetch incident with row lock (no includes to avoid LEFT OUTER JOIN Postgres error)
      const incident = await Incident.findByPk(id, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!incident) {
        await transaction.rollback();
        res.status(404).json({
          error: 'Incident not found',
        });
        return;
      }

      // Validate incident belongs to responder's station
      if (incident.station_id !== responder.station_id) {
        await transaction.rollback();
        res.status(403).json({
          error: 'This incident is not assigned to your station',
        });
        return;
      }

      // Validate incident is still pending
      if (incident.status !== 'PENDING') {
        await transaction.rollback();
        res.status(409).json({
          error: 'This incident has already been claimed or resolved',
        });
        return;
      }

      // Claim the incident
      incident.responder_id = responder.id;
      incident.status = 'RESPONDING';
      incident.accepted_at = new Date();
      await incident.save({ transaction });

      // Mark responder as busy
      responder.status = 'BUSY';
      await responder.save({ transaction });

      await transaction.commit();

      // Re-fetch with associations for response (after commit, no lock needed)
      const claimedIncident = await Incident.findByPk(id, {
        include: [
          {
            model: Station,
            attributes: ['id', 'name', 'category'],
          },
          {
            model: User,
            as: 'citizen',
            attributes: ['id', 'name', 'email', 'number', 'oauth_provider'],
          },
          {
            model: Responder,
            attributes: ['id', 'status'],
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'number'],
              },
            ],
          },
        ],
      });

      // Notify citizen and station
      publishCitizenIncidentUpdate(incident.citizen_id, {
        type: 'incident_claimed',
        status: 'RESPONDING',
      });

      const { publishStationIncidentUpdate } = await import('../services/sseService');
      publishStationIncidentUpdate(responder.station_id, {
        type: 'incident_claimed',
        incidentId: id,
      });

      res.status(200).json({
        message: 'Incident claimed successfully',
        data: claimedIncident,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error claiming incident:', error);

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

export const arriveIncident = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find responder for current user
    const responder = await Responder.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Station, attributes: ['id', 'name', 'category'] }],
    });

    if (!responder) {
      res.status(404).json({
        error: 'Responder profile not found. Please contact admin.',
      });
      return;
    }

    // Use transaction with row lock
    const transaction = await sequelize.transaction();

    try {
      const incident = await Incident.findByPk(id, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!incident) {
        await transaction.rollback();
        res.status(404).json({
          error: 'Incident not found',
        });
        return;
      }

      // Validate responder is assigned to this incident
      if (incident.responder_id !== responder.id) {
        await transaction.rollback();
        res.status(403).json({
          error: 'You are not assigned to this incident',
        });
        return;
      }

      // Validate incident is in RESPONDING state
      if (incident.status !== 'RESPONDING') {
        await transaction.rollback();
        res.status(409).json({
          error: 'Incident must be in RESPONDING state to mark as arrived',
        });
        return;
      }

      // Mark as ARRIVED
      incident.status = 'ARRIVED';
      await incident.save({ transaction });

      await transaction.commit();

      // Notify citizen
      publishCitizenIncidentUpdate(incident.citizen_id, {
        type: 'incident_arrived',
        status: 'ARRIVED',
      });

      // Notify other responders at station
      const { publishStationIncidentUpdate } = await import('../services/sseService');
      publishStationIncidentUpdate(responder.station_id, {
        type: 'incident_arrived',
        incidentId: id,
      });

      // Re-fetch with associations for response
      const arrivedIncident = await Incident.findByPk(id, {
        include: [
          {
            model: Station,
            attributes: ['id', 'name', 'category'],
          },
          {
            model: User,
            as: 'citizen',
            attributes: ['id', 'name', 'email', 'number', 'oauth_provider'],
          },
          {
            model: Responder,
            attributes: ['id', 'status'],
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'number'],
              },
            ],
          },
        ],
      });

      res.status(200).json({
        message: 'Incident marked as arrived',
        data: arrivedIncident,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error marking incident as arrived:', error);

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

export const resolveIncident = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find responder for current user
    const responder = await Responder.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Station, attributes: ['id', 'name', 'category'] }],
    });

    if (!responder) {
      res.status(404).json({
        error: 'Responder profile not found. Please contact admin.',
      });
      return;
    }

    // Use transaction with row lock
    const transaction = await sequelize.transaction();

    try {
      const incident = await Incident.findByPk(id, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!incident) {
        await transaction.rollback();
        res.status(404).json({
          error: 'Incident not found',
        });
        return;
      }

      // Validate responder is assigned to this incident
      if (incident.responder_id !== responder.id) {
        await transaction.rollback();
        res.status(403).json({
          error: 'You are not assigned to this incident',
        });
        return;
      }

      // Validate incident is in ARRIVED state
      if (incident.status !== 'ARRIVED') {
        await transaction.rollback();
        res.status(409).json({
          error: 'Incident must be in ARRIVED state to mark as resolved',
        });
        return;
      }

      // Mark as RESOLVED and set responder back to AVAILABLE
      incident.status = 'RESOLVED';
      await incident.save({ transaction });

      responder.status = 'AVAILABLE';
      await responder.save({ transaction });

      await transaction.commit();

      // Notify citizen
      publishCitizenIncidentUpdate(incident.citizen_id, {
        type: 'incident_resolved',
        status: 'RESOLVED',
      });

      // Notify other responders at station
      const { publishStationIncidentUpdate } = await import('../services/sseService');
      publishStationIncidentUpdate(responder.station_id, {
        type: 'incident_resolved',
        incidentId: id,
      });

      // Re-fetch with associations for response
      const resolvedIncident = await Incident.findByPk(id, {
        include: [
          {
            model: Station,
            attributes: ['id', 'name', 'category'],
          },
          {
            model: User,
            as: 'citizen',
            attributes: ['id', 'name', 'email', 'number', 'oauth_provider'],
          },
          {
            model: Responder,
            attributes: ['id', 'status'],
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'number'],
              },
            ],
          },
        ],
      });

      res.status(200).json({
        message: 'Incident marked as resolved',
        data: resolvedIncident,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error marking incident as resolved:', error);

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

export const getIncidentById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Find responder for current user
    const responder = await Responder.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Station, attributes: ['id', 'name', 'category'] }],
    });

    if (!responder) {
      res.status(404).json({
        error: 'Responder profile not found. Please contact admin.',
      });
      return;
    }

    // Fetch incident with all associations
    const incident = await Incident.findByPk(id, {
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
        {
          model: User,
          as: 'citizen',
          attributes: ['id', 'name', 'email', 'number', 'oauth_provider'],
        },
        {
          model: Responder,
          attributes: ['id', 'status'],
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'number'],
            },
          ],
        },
      ],
    });

    if (!incident) {
      res.status(404).json({
        error: 'Incident not found',
      });
      return;
    }

    // Validate incident belongs to responder's station
    if (incident.station_id !== responder.station_id) {
      res.status(403).json({
        error: 'This incident is not assigned to your station',
      });
      return;
    }

    res.status(200).json({
      message: 'Incident details retrieved',
      data: incident,
    });
  } catch (error) {
    console.error('Error fetching incident:', error);

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

export const streamStationIncidents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Find responder for current user
    const responder = await Responder.findOne({
      where: { user_id: req.user.id },
      include: [{ model: Station, attributes: ['id', 'name', 'category'] }],
    });

    if (!responder) {
      res.status(404).json({
        error: 'Responder profile not found. Please contact admin.',
      });
      return;
    }

    // Import dynamically to avoid issues at module load time
    const redisClientDefault = await import('../config/redis');
    const redisClient = redisClientDefault.default;
    const subClient = redisClient.duplicate();

    // Attempt to connect before sending headers
    await subClient.connect();

    // Only set SSE headers after successful Redis connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const channelName = `station:${responder.station_id}:incidents`;
    await subClient.subscribe(channelName, (message: string) => {
      res.write(`data: ${message}\n\n`);
    });

    // Heartbeat to keep connection alive
    const heartbeatInterval = setInterval(() => {
      res.write(':heartbeat\n\n');
    }, 20000);

    // Cleanup on client disconnect
    req.on('close', async () => {
      clearInterval(heartbeatInterval);
      await subClient.unsubscribe(channelName);
      await subClient.quit();
    });
  } catch (error) {
    console.error('Error setting up station SSE stream:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to establish stream',
      });
    }
  }
};

export const streamCitizenIncident = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Import dynamically to avoid issues at module load time
    const redisClientDefault = await import('../config/redis');
    const redisClient = redisClientDefault.default;
    const subClient = redisClient.duplicate();

    // Attempt to connect before sending headers
    await subClient.connect();

    // Only set SSE headers after successful Redis connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const channelName = `citizen:${req.user.id}:incident`;
    await subClient.subscribe(channelName, (message: string) => {
      res.write(`data: ${message}\n\n`);
    });

    // Heartbeat to keep connection alive
    const heartbeatInterval = setInterval(() => {
      res.write(':heartbeat\n\n');
    }, 20000);

    // Cleanup on client disconnect
    req.on('close', async () => {
      clearInterval(heartbeatInterval);
      await subClient.unsubscribe(channelName);
      await subClient.quit();
    });
  } catch (error) {
    console.error('Error setting up SSE stream:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to establish stream',
      });
    }
  }
};

export const getMyCitizenRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
      });
      return;
    }

    // Find the most recent active request for this citizen
    const incident = await Incident.findOne({
      where: {
        citizen_id: req.user.id,
        status: ['PENDING', 'RESPONDING', 'ARRIVED'],
      },
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'category',
        'status',
        'location',
        'created_at',
        'accepted_at',
      ],
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
        {
          model: Responder,
          attributes: ['id', 'status'],
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'number'],
            },
          ],
          required: false,
        },
      ],
    });

    res.status(200).json({
      message: 'Request retrieved',
      data: incident,
    });
  } catch (error) {
    console.error('Error fetching citizen request:', error);

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
