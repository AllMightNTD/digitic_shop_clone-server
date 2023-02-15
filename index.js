const bodyParser = require('body-parser')
const express = require('express')
const db = require('././configs/dbConnect')
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const authRouter = require("././routes/authRoute")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

db.connect();
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/user' , authRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})