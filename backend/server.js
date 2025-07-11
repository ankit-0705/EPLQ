const connectToMongo = require('./config/db');
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.Port || 5000;

//Middlewares
app.use((req, res, next) => {
  // Allow requests from your specific origin
  res.setHeader('Access-Control-Allow-Origin', 'https://eplq-two.vercel.app');
  // Or allow from any origin (less secure)
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors({origin:'*',credential:true}));
app.use(express.json()); 

//Routes
app.use('/api/poi',require('./routes/poiPage'));
app.use('/api/user',require('./routes/userPage'));

//Start server and Handle errors
try {
  app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`)
  })
} catch (error) {
  console.error(`Error occured: ${error.message}.`);
  process.exit(1);
}

//Connect to MongoDB
try {
  connectToMongo(); 
} catch (error) {
  console.error(`Error occured: ${error.message}.`);
  process.exit(1);
}