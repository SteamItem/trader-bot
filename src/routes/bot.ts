import express = require('express');
import botController = require('../controllers/bot');

export = (app: express.Express) => {
  app.get('/start/:id', async (req, res) => {
    const id = req.params.id;
    botController.startBot(id)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.get('/stop/:id', async (req, res) => {
    const id = req.params.id;
    botController.stopBot(id)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}