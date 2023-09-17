const express = require('express');
const { setupRoutes } = require('./routes');
const config = require('./config');

const app = express();

config.mongooseConnect();

setupRoutes(app);

app.listen(config.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${config.PORT}`);
});