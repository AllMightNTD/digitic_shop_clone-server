const bodyParser = require('body-parser');
const express = require('express');
const db = require('././configs/dbConnect');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('././routes/authRoute');
const productRouter = require('././routes/productRouter');
const blogRoute = require('././routes/blogRoute');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));
db.connect();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRoute);

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`);
});
