import Express from 'express';
import { getMyResponderProfile } from '../controllers/responderControllers';
import { authenticate, isResponder } from '../middlewares/authenticate';

const responderRouter = Express.Router();

responderRouter.get('/', authenticate, isResponder, getMyResponderProfile);

export default responderRouter;
