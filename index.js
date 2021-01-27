const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const express = require('express');

const app = express(); //analogue of http.createServer
const mainPageRouter = require('./routes/mainPage');
const addRouter = require('./routes/add');
const coursesRouter = require('./routes/courses');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const loginRouter = require('./routes/auth');
const userMiddleware = require('./middlewares/user');

const PORT = process.env.PORT || 3000;

// ++HANDLEBARS SETUP

// const hbs = exphbs.create({
//   defaultLayout: 'main',
//   extname: 'hbs'
// });

app.engine('hbs', exphbs.create({
  handlebars: allowInsecurePrototypeAccess(handlebars), // added instead of three closest lines of code upper
  defaultLayout: 'main',
  extname: 'hbs'
}).engine); // 'engine' property must be accessed
app.set('view engine', 'hbs');
app.set('views', 'pages');
//--HANDLEBARS SETUP over

const password = 'yk6ocJDs4PQJ1lSJ';
const dbname = 'shop';
const MONGODB_URI = `mongodb+srv://Alexey:${password}@cluster0.oyej3.mongodb.net/${dbname}`;

const mongoStore = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI,
}, err => {
  if(err) throw new Error(err);
});
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: 'some secret value',
  saveUninitialized: false,
  resave: false,
  store: mongoStore
}));
app.use(csurf());
app.use(flash());
app.use((req, res, next) => { // to add data that will be given to templates with every response
  res.locals.isAuth = req.session.isAuthenticated;
  res.locals.csurf = req.csrfToken();
  next();
});
app.use(userMiddleware);
app.use('/', mainPageRouter);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/login', loginRouter);

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();