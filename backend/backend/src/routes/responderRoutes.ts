import Express from 'express';
import { getMyResponderProfile, updateMyLocation } from '../controllers/responderControllers';
import { authenticate, isResponder } from '../middlewares/authenticate';

const responderRouter = Express.Router();

responderRouter.get('/', authenticate, isResponder, getMyResponderProfile);
responderRouter.patch('/me/location', authenticate, isResponder, updateMyLocation);

export default responderRouter;
