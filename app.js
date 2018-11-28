const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');

const indexRouter = require('./src/routes/index');
const partiesRouter = require('./src/routes/partie');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS middleware
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*')
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)
  // Pass to next layer of middleware
  next()
})

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'tennis-client/build')));

app.use('/', indexRouter);
app.use('/parties', partiesRouter);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/tennis-client/build/index.html'));
});

const generateur = require('./src/generateur');
generateur.demarrer();

module.exports = app;
