const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');
// alternative way to call the tourController functions :
// const { getAllTours, createTour, getTour, updateTour, deleteTour } = require('./../controllers/tourController');

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
