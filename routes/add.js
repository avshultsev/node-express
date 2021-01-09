const {Router} = require('express');
const router = Router();
const Course = require('../models/course');

router.get('/', (req, res, next) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true
    });
});

router.post('/', async (req, res) => {
    const course = new Course({...req.body, userId: req.user._id});
    
    try {
        await course.save();
        res.redirect('/courses');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;