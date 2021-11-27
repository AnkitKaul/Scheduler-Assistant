import express from 'express';
import Event from '../../models/event';
import User from '../../models/user';
import { isStaff } from '../common/AuthCheck';

const router = express.Router();

router.get('/', isStaff, (req, res) => {
  res.locals.options.page = 'create';
  res.render('create', res.locals.options);
});

router.post('/', isStaff, async (req, res) => {
  let { eventName, summary, startDate, endDate, capacity, room, prerequisites} = req.body;
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  let username = res.locals.options.username;
  let manager = await User.findOne({username});
  let branch = manager.branch;
  let event_details = {
    eventName,
    summary,
    startDate,
    endDate,
    capacity,
    branch,
    manager: manager._id,
    room,
  }
  if(prerequisites) { event_details.prerequisites = prerequisites;  }
  Event.create(event_details).then(event => {
    User.findOneAndUpdate(
      { username: res.locals.options.username },
      {
        $push: {
          history: {
            action: `Created event <a href="/event/id/${event.eventId}">${event.eventName}</a>`,
            time: Date.now()
          }
        }
      }
    ).then(() => res.status(201).json({ id: event.eventId }));
  }).catch(error => {
    res.status(500).json({ message: 'Error when creating event' });
  });
});

export default router;