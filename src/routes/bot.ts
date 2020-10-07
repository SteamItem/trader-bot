import express = require('express');
import botController = require('../controllers/bot');

export = (app: express.Express) => {
  app.get('/bot/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    botController.findOne(id)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/bot/:_id', async (req, res) => {
    const id = parseInt(req.params._id);
    botController.update(id, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}