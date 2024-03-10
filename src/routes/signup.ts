import { Router } from 'express';
import { createUser } from '../user/user.controllers';
import validateRequestData from '../middlewares/validators';

const signupRoute = Router();

signupRoute.post('/signup', validateRequestData.signup, createUser);

export default signupRoute;
