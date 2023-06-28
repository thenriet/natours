const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (val > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'invalid Id' });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  console.log('Check body is called');
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'failed', message: 'Missing name or price' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: { tours: tours },
  });
};

exports.getTour = (req, res) => {
  // callback function used with the find function will return
  // the only element that match req.params (so the id present in the url)
  // JS trick : multiply a string that looks like a number will automatically convert it to a number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({ status: 'success', data: { tour: tour } });
};

exports.createTour = (req, res) => {
  //   console.log(req.body);
  //Get the the id from the last object from the db and add 1 to it
  const newId = tours[tours.length - 1].id + 1;
  // Use Object.assign to merge 2 objects into a new one
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
