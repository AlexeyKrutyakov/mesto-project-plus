import { Router } from 'express';
import { signin } from '../user/user.controllers';
import validateRequestData from '../middlewares/validators';

const signinRoute = Router();

signinRoute.post('/signin', validateRequestData.signin, signin);

export default signinRoute;
