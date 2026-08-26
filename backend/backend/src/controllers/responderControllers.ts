import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';
import User from '../models/userModels';
import Responder from '../models/responderModels';
import Station from '../models/stationModels';
import Incident from '../models/incidentModel';

interface CreateResponderRequest {
  name: string;
  email: string;
  password: string;
  number?: string;
  station_id: number;
}

interface UpdateResponderRequest {
  station_id?: number;
  status?: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
}

export const createResponder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password, number, station_id } = req.body as CreateResponderRequest;

    // Validation: required fields
    if (!name || !email || !password || station_id === undefined) {
      res.status(400).json({
        error: 'Missing required fields: name, email, password, station_id',
      });
      return;
    }

    // Validation: email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: 'Invalid email format',
      });
      return;
    }

    // Check if station exists
    const station = await Station.findByPk(station_id);
    if (!station) {
      res.status(404).json({
        error: 'Station not found',
      });
      return;
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        error: 'Email already in use',
      });
      return;
    }

    // Create user and responder in a transaction
    const transaction = await sequelize.transaction();

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await User.create(
        {
          name: name.trim(),
          email: email.trim(),
          password: hashedPassword,
          number: number?.trim() || null,
          role: 'responder',
          verified: true,
          oauth_provider: 'local',
        },
        { transaction },
      );

      const responder = await Responder.create(
        {
          user_id: user.id,
          station_id,
          status: 'AVAILABLE',
        },
        { transaction },
      );

      await transaction.commit();

      // Fetch the created responder with associations
      const createdResponder = await Responder.findByPk(responder.id, {
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] },
          },
          {
            model: Station,
            attributes: ['id', 'name', 'category'],
          },
        ],
      });

      res.status(201).json({
        message: 'Responder created successfully',
        data: createdResponder,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error creating responder:', error);

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

export const getResponders = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const responders = await Responder.findAll({
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
      ],
    });

    const formattedResponders = responders.map((responder: any) => ({
      id: responder.id,
      name: responder.User?.name,
      email: responder.User?.email,
      number: responder.User?.number,
      station_id: responder.station_id,
      station_name: responder.Station?.name,
      station_category: responder.Station?.category,
      status: responder.status,
      created_at: responder.created_at,
      updated_at: responder.updated_at,
    }));

    res.status(200).json({
      message: 'Responders retrieved successfully',
      data: formattedResponders,
    });
  } catch (error) {
    console.error('Error fetching responders:', error);

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

export const updateResponder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { station_id, status } = req.body as UpdateResponderRequest;

    // Validation: at least one field provided
    if (station_id === undefined && status === undefined) {
      res.status(400).json({
        error: 'At least one field (station_id, status) is required',
      });
      return;
    }

    // Check if responder exists
    const responder = await Responder.findByPk(id);
    if (!responder) {
      res.status(404).json({
        error: 'Responder not found',
      });
      return;
    }

    // Validate station if provided
    if (station_id !== undefined) {
      const station = await Station.findByPk(station_id);
      if (!station) {
        res.status(404).json({
          error: 'Station not found',
        });
        return;
      }
      responder.station_id = station_id;
    }

    // Validate status if provided
    if (status !== undefined) {
      const validStatuses = ['AVAILABLE', 'BUSY', 'OFF_DUTY'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          error: 'Invalid status. Must be one of: AVAILABLE, BUSY, OFF_DUTY',
        });
        return;
      }
      responder.status = status;
    }

    await responder.save();

    // Fetch updated responder with associations
    const updatedResponder = await Responder.findByPk(id, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] },
        },
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
      ],
    });

    res.status(200).json({
      message: 'Responder updated successfully',
      data: updatedResponder,
    });
  } catch (error) {
    console.error('Error updating responder:', error);

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

export const deleteResponder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const responder = await Responder.findByPk(id);
    if (!responder) {
      res.status(404).json({
        error: 'Responder not found',
      });
      return;
    }

    await responder.destroy();

    res.status(200).json({
      message: 'Responder deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting responder:', error);

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

export const getMyResponderProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const responder = await Responder.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: Station,
          attributes: ['id', 'name', 'category'],
        },
      ],
    });

    if (!responder) {
      res.status(404).json({
        error: 'Responder profile not found. Please contact admin.',
      });
      return;
    }

    // Check if responder has an active task (check for RESPONDING or ARRIVED status)
    const activeTask = await Incident.findOne({
      where: {
        responder_id: responder.id,
        status: ['RESPONDING', 'ARRIVED'],
      },
    });

    const profileData = {
      ...responder.toJSON(),
      has_active_task: !!activeTask,
    };

    res.status(200).json({
      message: 'Responder profile retrieved',
      data: profileData,
    });
  } catch (error) {
    console.error('Error fetching responder profile:', error);

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
