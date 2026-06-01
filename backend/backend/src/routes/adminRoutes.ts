// src/routes/adminRoutes.ts
import Express from 'express';
import {
  createStation,
  getStations,
  getStationsGeoJSON,
  getZonesGeoJSON,
} from '../controllers/adminControllers';
import { authenticate, isAdmin } from '../middlewares/authenticate';

const adminRouter = Express.Router();

// Public endpoints for GeoJSON
adminRouter.get('/stations/geojson', getStationsGeoJSON);
adminRouter.get('/zones/geojson', getZonesGeoJSON);

// Protected endpoints
adminRouter.get('/stations', authenticate, isAdmin, getStations);
adminRouter.post('/stations', authenticate, isAdmin, createStation);

export default adminRouter;
