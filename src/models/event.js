import mongoose from 'mongoose';
import Counter from './counter';
import User from './user';
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  eventId: {
    type: Number
  },
  eventName: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  currentBookings: {
    type: Number,
    default: 0
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE','Mech','EC'],
    default: 'CSE'
  },
  manager: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },
  room: {
    type: String,
    required: true,
    default: 'NA'
  },
  prerequisites: {
    type: String,
    default: 'No Prerequisite required'
  }
});

eventSchema.index({eventName: 'text', summary: 'text'});

eventSchema.pre('save', function (next) {
  var event = this;
  if (!event.isNew) {
    next();
  }
  Counter.count({}).then(count => {
    if (count === 0) {
      Counter.create({
        _id: 'entity',
        value: 1000
      }).then(result => {
        event.eventId = result.value;
        next();
      });
    } else {
      Counter.findOneAndUpdate(
        { _id: 'entity' },
        { $inc: { value: 1 } },
        { new: true }).then(result => {
          event.eventId = result.value;
          next();
        });
    }
  });
});

const Event = mongoose.model('Event', eventSchema);
export default Event;