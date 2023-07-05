import express from 'express';
import controllers from './controllers';
const router = express.Router();

router.post('/signup', controllers.users.signup);

export default router;
