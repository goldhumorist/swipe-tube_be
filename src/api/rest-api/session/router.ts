import express from 'express';
import controllers from './controllers';
const router = express.Router();

const checkToken = controllers.session.checkToken;

router.get('/check', checkToken);

export default router;
