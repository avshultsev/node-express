const { Router } = require('express');
const router = Router();
const Course = require('../models/course');

router.get('/', async (req, res, next) => { // render all courses
  const courses = await Course.find();

  res.render('courses', {
    title: 'Courses List',
    isCourses: true,
    courses
  });
});

router.get('/:id', async (req, res, next) => { // render a specific course
  const course = await Course.findById(req.params.id);

  res.render('course', {
    layout: 'empty',
    title: `${course.title} Course`,
    course
  });
});

router.get('/:id/edit', async (req, res) => { // edit a specific course
  if (!req.query.allow) return res.redirect('/');

  const course = await Course.findById(req.params.id);

  res.render('course-edit', {
    title: `Edit ${course.title} course`,
    course
  });
});

router.post('/edit', async (req, res) => { // save edition of a specific course
  const { id } = req.body;
  delete req.body.id;
  await Course.findByIdAndUpdate(id, req.body);
  res.redirect('/courses');
});

router.post('/remove', async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect('/courses');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;