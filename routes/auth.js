const {Router} = require('express');
const router = Router();
const User = require('../models/user');
const auth = require('../middlewares/auth');
const bcryptjs = require('bcryptjs');

router.get('/', async (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    signInError: req.flash('signInError'),
    registerError: req.flash('registerError')
  });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const candidate = await User.findOne({ email });

  if(candidate) {
    const areSame = await bcryptjs.compare(password, candidate.password);
    if(areSame) {
      req.session.user = candidate;
      req.session.isAuthenticated = true;
      req.session.save(err => {
        if(err) throw new Error(err);
        res.redirect('/');
      });
    } else {
      req.flash('signInError', 'Wrong email or password.');
      res.redirect('/login#signin');
    }
  } else {
    req.flash('signInError', 'Wrong email or password.');
    res.redirect('/login#signin');
  }
});

router.post('/register', async (req, res) => {
  const { remail: email, name, rpassword: password, confirm } = req.body;
  const candidate = await User.findOne({ email });

  if(candidate) {
    req.flash('registerError', 'User with such email already exists.');
    res.redirect('/login#register');
  } else {
    const hashed = await bcryptjs.hash(password, 10);
    const user = new User({ email, name, password: hashed, cart: {items: []} });
    await user.save();
    res.redirect('/login#signin');
  }
});

router.get('/logout', auth, async (req, res) => {
  req.session.destroy(err => {
    if(err) throw new Error(err);
    res.redirect('/');
  });
});

module.exports = router;