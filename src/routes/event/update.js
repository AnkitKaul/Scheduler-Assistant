import express from 'express';
import Event from '../../models/event';
import User from '../../models/user';
import { parseEvent } from '../common/ParserClass';
import { isStaff } from '../common/AuthCheck';
const router = express.Router();

router.get('/id/:eventID/', isStaff, (req, res) => {
  res.locals.options.page = 'manage-events';
  Event.findOne({ eventId: req.params.eventID }).then(result => {
    if (!result) {
      return res.status(404).render('error_views/class-not-found', {
        error: 'Invalid ID: ' + req.params.eventID,
        link: '/'
      });
    }
    res.locals.options.event = parseEvent(result);
    res.render('update-event', res.locals.options);
  }).catch(() => {
    return res.status(404).render('error_views/class-not-found', {
      error: 'Invalid ID: ' + req.params.eventID,
      link: '/'
    });
  });
});

router.put('/id/:eventID/', isStaff, async (req, res) => {
  let { eventName, summary, startDate, endDate, capacity} = req.body;
  startDate = new Date(startDate);
  endDate = new Date(endDate);

  let event = await Event.findOne({ eventId: req.params.eventID });

  if (capacity < event.currentBookings) {
    return res.json({ error: 'Error Class Capacity must be higher than current!!!' });
  }

  Event.findOneAndUpdate({ eventId: req.params.eventID }, {
    eventName,
    summary,
    startDate,
    endDate,
    capacity,
  }).then(event => {
    User.findOneAndUpdate(
      { username: res.locals.options.username },
      {
        $push: {
          history: {
            action: `Class Details Updated <a href="/event/id/${event.eventId}">${event.eventName}</a>`,
            time: Date.now()
          }
        }
      }
    ).then(() => res.status(201).json({ id: event.eventId }));
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: 'Error!!! Updation Stopped' });
  });
});

export default router;