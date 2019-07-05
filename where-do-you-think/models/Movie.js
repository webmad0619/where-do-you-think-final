const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaName = new Schema({
  name: String,
  year: Number,
  linkIMDB: String,
  photoLocation: String,
  photoName: String,
  recordedInLocation: { type: { type: String }, coordinates: [Number] },
  city: String,
  country: String
});

schemaName.index({ location: '2dsphere' });

const Model = mongoose.model('Movie', schemaName);
module.exports = Model;