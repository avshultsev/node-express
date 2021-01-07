const e = require('express');
const fs = require('fs');
const path = require('path');
const Course = require('./course');

const pathToCart = path.join(__dirname, '..', 'data', 'cart.json');

class Cart {
  static async add(id) {
    const cart = await Cart.getAll();
    const targetCourse = await Course.getById(id);
    const index = cart.courses.findIndex(obj => obj.course.id === id);

    if (index === -1) {
      cart.courses.push({course: targetCourse, quantity: 1});
    } else {
      const obj = {...cart.courses[index]};
      obj.quantity++;
      cart.courses[index] = obj;
    }
    cart.totalPrice += +targetCourse.price;

    fs.writeFile(
      pathToCart,
      JSON.stringify(cart),
      err => {
        if (err) throw new Error(err);
      }
    );
  }

  static async remove(id) {
    const cart = await Cart.getAll();
    const index = cart.courses.findIndex(obj => obj.course.id === id)
    const cartItem = {...cart.courses[index]};

    if (cartItem.quantity === 1) {
      const courses = cart.courses.filter(obj => obj.course.id !== id);
      cart.courses = courses;
    } else {
      cartItem.quantity--;
      cart.courses[index] = cartItem;
    }
    cart.totalPrice -= +cartItem.course.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(
        pathToCart,
        JSON.stringify(cart),
        err => err ? reject(err) : resolve(cart)
      );
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        pathToCart,
        'utf-8',
        (err, data) => err ? reject(err) : resolve(JSON.parse(data)));
    })
  }
}

module.exports = Cart;