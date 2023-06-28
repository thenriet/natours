const express = require('express');
const fs = require('fs');

const app = express();

// This is a middleware, a function that can modifiy the incoming data
// It is needed to get access to the req.body from the POST request
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours: tours } });
});

app.post('/api/v1/tours', (req, res) => {
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
});

// doesnt really update anything, this is just to demonstrate the logic
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'invalid Id' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>',
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  // callback function used with the find function will return
  // the only element that match req.params (so the id present in the url)
  // JS trick : multiply a string that looks like a number will automatically convert it to a number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'invalid Id' });
  }
  res.status(200).json({ status: 'success', data: { tour: tour } });
});

// doesnt really delete anything, this is just to demonstrate the logic

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'invalid Id' });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
