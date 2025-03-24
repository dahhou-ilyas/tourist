const mongoose = require('mongoose');

const LocationGeoSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  neighborhood: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point', 'LineString', 'Polygon'],
      required: true
    },
    coordinates: {
      type: [],
      required: true
    }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

LocationGeoSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('LocationGeo', LocationGeoSchema);