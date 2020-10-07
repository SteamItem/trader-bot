import express = require('express');

export = (app: express.Express) => {
  app.get('/', (_req, res) => {
    res.send("Hello World");
  });
}