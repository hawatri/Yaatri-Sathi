import express from 'express';
import {
  createJourney,
  getJourneys,
  getJourney,
  updateJourney,
  deleteJourney,
  getCurrentJourney
} from '../controllers/journey.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Journey routes - protected
router.post('/create', authenticate, createJourney);
router.get('/', authenticate, getJourneys); // Gets all journeys for the authenticated user
router.get('/current', authenticate, getCurrentJourney); // Gets current active journey for the authenticated user
router.get('/:journeyId', authenticate, getJourney);
router.put('/:journeyId', authenticate, updateJourney);
router.delete('/:journeyId', authenticate, deleteJourney);

export default router;