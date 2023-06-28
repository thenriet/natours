const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// environment variables made by express.js
console.log(app.get('env'));
// environment variables made by node.js
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
