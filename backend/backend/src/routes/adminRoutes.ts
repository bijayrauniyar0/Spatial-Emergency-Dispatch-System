// src/routes/adminRoutes.ts
import Express from 'express';
import {
  createStation,
  getStations,
  getStationsGeoJSON,
  getZonesGeoJSON,
} from '../controllers/adminControllers';
import {
  createResponder,
  getResponders,
  updateResponder,
  deleteResponder,
} from '../controllers/responderControllers';
import { authenticate, isAdmin } from '../middlewares/authenticate';

const adminRouter = Express.Router();

// Public endpoints for GeoJSON
adminRouter.get('/stations/geojson', getStationsGeoJSON);
adminRouter.get('/zones/geojson', getZonesGeoJSON);

// Protected station endpoints
adminRouter.get('/stations', authenticate, isAdmin, getStations);
adminRouter.post('/stations', authenticate, isAdmin, createStation);

// Protected responder endpoints
adminRouter.get('/responders', authenticate, isAdmin, getResponders);
adminRouter.post('/responders', authenticate, isAdmin, createResponder);
adminRouter.patch('/responders/:id', authenticate, isAdmin, updateResponder);
adminRouter.delete('/responders/:id', authenticate, isAdmin, deleteResponder);

export default adminRouter;
