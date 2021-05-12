const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();


//server setup
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//mongoDB connect
mongoose.Promise = global.Promise
mongoose.connect(process.env.MDB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:true
}).then(
  () => {
    console.log('Database connected!, successfullly.')
  },
  error => {
    console.log('Could not connect to database : ', error)
  }
)
//------------------------//
const verification = require('./routes/verifyToken');
//set up routes
app.get('/api',verification.verifyLogin);
app.use('/api/login',require('./routes/authRoutes'));
app.use('/api/user',verification.verify, require('./routes/userRoutes'));
app.use('/api/hr',verification.HR,require('./routes/hrRoutes'));
app.use('/api/bdm',verification.BDM,require('./routes/bdmRoutes'));
app.use('/api',verification.DEV,require('./routes/devRoutes'));
// app.use('/api/bdm',require('./routes/bdmRoutes'));

app.listen(PORT, ()=> console.log(`Server started on the port: ${PORT}`));


