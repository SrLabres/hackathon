const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { getHomePage, uploadFile, getData } = require('./controllers');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const setupRoutes = (app) => {
    app.use(cors());
    app.use(express.json());
    app.get('/', getHomePage);
    app.post('/upload/:collection', upload.single('file'), uploadFile);
    app.get('/data', getData);
}

module.exports = {
    setupRoutes
};