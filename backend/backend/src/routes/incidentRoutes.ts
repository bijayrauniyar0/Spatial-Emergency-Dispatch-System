import Express from 'express';
import {
  createIncident,
  getActiveIncident,
  getMyCitizenRequest,
  getStationQueue,
  getMyTask,
  claimIncident,
  streamCitizenIncident,
} from '../controllers/incidentControllers';
import { maybeAuthenticate, authenticate, isResponder } from '../middlewares/authenticate';

const incidentRouter = Express.Router();

incidentRouter.post('/', maybeAuthenticate, createIncident);
incidentRouter.get('/stream', maybeAuthenticate, streamCitizenIncident);
incidentRouter.get('/my-request', maybeAuthenticate, getMyCitizenRequest);
incidentRouter.get('/active', maybeAuthenticate, getActiveIncident);
incidentRouter.get('/station-queue', authenticate, isResponder, getStationQueue);
incidentRouter.get('/my-task', authenticate, isResponder, getMyTask);
incidentRouter.patch('/:id/claim', authenticate, isResponder, claimIncident);

export default incidentRouter;
