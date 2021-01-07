const {Router} = require('express');
const router = Router();
const Cart = require('../models/cart');

router.get('/', async (req, res, next) => {
  const cart = await Cart.getAll();
  // console.log(cart.courses.length, cart.totalPrice);
  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses: cart.courses,
    totalPrice: cart.totalPrice
  });
});

router.delete('/remove/:id', async (req, res) => {
  const cart = await Cart.remove(req.params.id);

  res.status(200).json(cart);
})

router.post('/add', async (req, res) => {
  await Cart.add(req.body.id);

  res.redirect('/cart');
});

module.exports = router;