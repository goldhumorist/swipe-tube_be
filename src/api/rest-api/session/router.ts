import express from 'express';
import controllers from './controllers';
const router = express.Router();

const checkSession = controllers.session.checkSession;

router.get('/check', checkSession);

export default router;
