const {Schema, model} = require('mongoose');

const courseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imgUrl: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // so that we could track the user who added the course
  }
});

courseSchema.method('toClient', function() {
  const course = this.toObject();

  course.id = course._id;
  delete course._id;

  return course;
});

module.exports = model('Course', courseSchema);