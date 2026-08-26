import Express from 'express';
import {
  createIncident,
  getActiveIncident,
  getMyCitizenRequest,
  getStationQueue,
  getMyTask,
  claimIncident,
  arriveIncident,
  resolveIncident,
  getIncidentById,
  streamCitizenIncident,
  streamStationIncidents,
} from '../controllers/incidentControllers';
import { maybeAuthenticate, authenticate, isResponder } from '../middlewares/authenticate';

const incidentRouter = Express.Router();

incidentRouter.post('/', maybeAuthenticate, createIncident);
incidentRouter.get('/stream', maybeAuthenticate, streamCitizenIncident);
incidentRouter.get('/station-stream', authenticate, isResponder, streamStationIncidents);
incidentRouter.get('/my-request', maybeAuthenticate, getMyCitizenRequest);
incidentRouter.get('/active', maybeAuthenticate, getActiveIncident);
incidentRouter.get('/station-queue', authenticate, isResponder, getStationQueue);
incidentRouter.get('/my-task', authenticate, isResponder, getMyTask);
incidentRouter.patch('/:id/claim', authenticate, isResponder, claimIncident);
incidentRouter.patch('/:id/arrive', authenticate, isResponder, arriveIncident);
incidentRouter.patch('/:id/resolve', authenticate, isResponder, resolveIncident);
incidentRouter.get('/:id', authenticate, isResponder, getIncidentById);

export default incidentRouter;
