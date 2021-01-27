const {Router} = require('express');
const router = Router();
const auth = require('../middlewares/auth');

const mapCourseItems = courses => {
  return courses.map(course => {
    return {
      course: {
        title: course.courseId.title,
        id: course.courseId.id // not "course.courseId._id" because of the data transformation in courseSchema
      },
      quantity: course.count
    }
  });
};

const calcTotalPrice = courses => {
  return courses.reduce((acc, course) => acc += +course.courseId.price * course.count, 0);
}

router.get('/', auth, async (req, res, next) => { // render cart items
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  
  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses: mapCourseItems(user.cart.items),
    totalPrice: calcTotalPrice(user.cart.items)
  });
});

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const cart = {
    courses: mapCourseItems(user.cart.items),
    totalPrice: calcTotalPrice(user.cart.items)
  };
  res.status(200).json(cart);
})

router.post('/add', auth, async (req, res) => {
  await req.user.addToCart(req.body.id);
  res.redirect('/cart');
});

module.exports = router;