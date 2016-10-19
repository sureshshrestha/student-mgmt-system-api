var mongoose = require('mongoose');
var StudentSchema = new mongoose.Schema({
  name: String,
  rollno: String,
  class: String,
  updated_at: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Student', StudentSchema);
