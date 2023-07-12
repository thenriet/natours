// const fs = require('fs');
const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (val > tours.length) {
//     return res.status(404).json({ status: 'failed', message: 'invalid Id' });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   console.log('Check body is called');
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'failed', message: 'Missing name or price' });
//   }
//   next();
// };

//////////////////////////////// MVC ARCHITECTURE STARTS HERE //////////////////////////////////

// Custom query for the top 5 and cheap tours
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Get all tours query
exports.getAllTours = async (req, res) => {
  try {
    /////// BUILD THE QUERY //////
    // 1A) Filtering
    const queryObj = { ...req.query }; // creates a new object with the properties from req.query
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // excludes __v in the response
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // page=2&limit=10, 1-10 on page 1 and 11-20 on page 2, etc
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // { difficulty: 'easy', duration: { $gte: 5} }
    // gte = greater or equal, gt = greater than
    // lte = lesser or equal, lt = lesser than

    /////// EXECUTE THE QUERY //////
    const tours = await query;
    // query.sort().select().skip().limit()

    ///// SEND RESPONSE /////

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours: tours },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Something went wrong' + err });
  }
};

exports.getTour = async (req, res) => {
  // callback function used with the find function will return
  // the only element that match req.params (so the id present in the url)
  // JS trick : multiply a string that looks like a number will automatically convert it to a number
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({ status: 'success', data: { tour: tour } });
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour: tour },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Something went wrong' + err });
  }
};

exports.createTour = async (req, res) => {
  //   console.log(req.body);
  //Get the the id from the last object from the db and add 1 to it
  // const newId = tours[tours.length - 1].id + 1;
  // Use Object.assign to merge 2 objects into a new one
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   // JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       // data: {
  //       //   tour: newTour,
  //       // },
  //     });
  //   }
  // );
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent',
      err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Cant delete this tour' + err,
    });
  }
};
