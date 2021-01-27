const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course', // same name of model that Course model has - connects the specific course in cart with courses table in database
          required: true
        },
        count: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ]
  },
});

userSchema.methods.addToCart = function(id) {
  const items = [...this.cart.items];
  const index = items.findIndex(item => item.courseId.toString() === id.toString());

  if (index >= 0) {
    items[index].count++;
  } else {
    items.push({ courseId: id, count: 1 });
  }

  this.cart = {items};
  return this.save();
};

userSchema.methods.removeFromCart = function(id) {
  let items = [...this.cart.items];
  const index = items.findIndex(item => item.courseId.toString() === id.toString());

  if (items[index].count === 1) {
    items = items.filter(item => item.courseId.toString() !== id.toString());
  } else {
    items[index].count--;
  }

  this.cart = {items};
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = {items: []};
  return this.save();
}

module.exports = model('User', userSchema);