import Express from 'express';
import { createIncident, getActiveIncident } from '../controllers/incidentControllers';
import { maybeAuthenticate } from '../middlewares/authenticate';

const incidentRouter = Express.Router();

incidentRouter.post('/', maybeAuthenticate, createIncident);
incidentRouter.get('/active', maybeAuthenticate, getActiveIncident);

export default incidentRouter;
