import express from 'express';
import controllers from './controllers';
import sessionController from '../session/controllers';

const router = express.Router();
const checkSession = sessionController.session.checkSession;

router.get('/list', checkSession, controllers.videos.list);

export default router;
