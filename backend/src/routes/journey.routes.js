import express from 'express';
import {
  createJourney,
  getJourneys,
  getJourney,
  updateJourney,
  deleteJourney,
  addItineraryItem,
  addVisitedLocation,
  getCurrentJourney
} from '../controllers/journey.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Journey routes - protected
router.post('/create', authenticate, createJourney);
router.get('/tourist/:touristId', authenticate, getJourneys);
router.get('/:journeyId', authenticate, getJourney);
router.put('/:journeyId', authenticate, updateJourney);
router.delete('/:journeyId', authenticate, deleteJourney);
router.post('/:journeyId/itinerary', authenticate, addItineraryItem);
router.post('/:journeyId/location', authenticate, addVisitedLocation);
router.get('/tourist/:touristId/current', authenticate, getCurrentJourney);

export default router;