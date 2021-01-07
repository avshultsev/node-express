const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const mongoose = require('mongoose');
const express = require('express');

const app = express(); //analogue of http.createServer

const mainPageRouter = require('./routes/mainPage');
const addRouter = require('./routes/add');
const coursesRouter = require('./routes/courses');
const cartRouter = require('./routes/cart');

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

app.use(express.static('public'));
app.use(express.urlencoded({
  extended: true
}));
app.use('/', mainPageRouter);
app.use('/add', addRouter);
app.use('/courses', coursesRouter);
app.use('/cart', cartRouter);

const start = async () => {
  const password = 'yk6ocJDs4PQJ1lSJ';
  const dbname = 'shop';
  const url = `mongodb+srv://Alexey:${password}@cluster0.oyej3.mongodb.net/${dbname}`;

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();