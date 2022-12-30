// const  connectToMongo  = require("./db");
const express = require('express');
const database = require('./db');
database();

// connectToMongo();
const app = express();
const port = 5000;
app.use(express.json())

//available routes
// app.get('/', (req, res) => {
//   res.send('Hello saugat!')
// })
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes')) 


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})