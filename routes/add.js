const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middlewares/auth');

router.get('/', auth, (req, res, next) => {
  res.render('add', {
    title: 'Add course',
    isAdd: true
  });
});

router.post('/', auth, async (req, res) => {
  const course = new Course({
    ...req.body,
    userId: req.user._id
  });

  try {
    await course.save();
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;