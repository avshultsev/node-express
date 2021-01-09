const {Router} = require('express');
const router = Router();
const Order = require('../models/order');

router.get('/', async (req, res) => {
  const orders = await Order.find({
    'user.userId': req.user._id // find only those orders that belong to the current user
  }).populate('user.userId');

  res.render('orders', {
    title: 'Orders',
    isOrders: true,
    orders: orders.map(order => {
      return {
        ...order._doc,
        totalPrice: order.courses.reduce((acc, course) => acc += course.count * course.course.price, 0)
      }
    })
  });
});

router.post('/', async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate();

    const order = new Order({
      user: {
        name: user.name,
        userId: user._id
      },
      courses: user.cart.items.map(course => ({
          course: course.courseId._doc,
          count: course.count
      }))
    });

    await order.save();
    await user.clearCart();
    res.redirect('/orders');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;