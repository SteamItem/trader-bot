import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import mongoHelper = require('./helpers/mongo');
import db = require('./db');
import botController = require('./controllers/bot');
import routes = require('./routes');
const PORT = process.env.PORT || 3000;

// create express app
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoHelper.connect();
db.sync();

routes.registerRoutes(app);

botController.handleBots();

// listen for requests
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
