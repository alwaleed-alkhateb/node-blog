require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDatabase = require('./server/config/db');
const app = express();

connectDatabase();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', '../views/layouts/main');
app.set('view engine', 'ejs');




app.use('/', require('./server/routes/main'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});