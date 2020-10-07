import express = require('express');
import cors = require('cors');
import paramController = require('../controllers/botParam');

export = (app: express.Express) => {
  app.get('/botParams/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    paramController.findOne(id)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
  app.put('/botParams/:_id', async (req, res) => {
    const id = parseInt(req.params._id);
    paramController.update(id, req.body.worker, req.body.code)
      .then(result => res.send(result))
      .catch(error => res.status(500).send(error));
  });
}