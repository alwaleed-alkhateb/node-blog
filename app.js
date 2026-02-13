require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const connectDatabase = require('./server/config/db');
const app = express();
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');

connectDatabase();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));


app.use(express.static('public'));

app.use(expressLayouts);
app.set('layout', '../views/layouts/main');
app.set('view engine', 'ejs');

// console.log("MongoStore Type:", typeof MongoStore);
// console.log("MongoStore Keys:", Object.keys(MongoStore));

const sessionStore = connectMongo.default || connectMongo;

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}));

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});