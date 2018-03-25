var mongoose = require('mongoose'),
    // mongoose schema method
    Schema = mongoose.Schema,
    // mongoose objectId
    ObjectId = Schema.ObjectId;

var db = require('../libs/db.js');

var pollSchema = new Schema({
  id: ObjectId,
  user_id: {
    type: String,
    required: true,
    trim: true
  },
  poll_name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  options: [],
  created_at: {
    type: Date,
    default: Date.now,
    trim: true
  },
  updated_at: {
    type: Date,
    trim: true
  }
});

var Poll = db.model('Poll', pollSchema);
module.exports = Poll;
