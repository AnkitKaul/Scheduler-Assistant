import express from 'express';
import Event from '../../models/event';
import User from '../../models/user';
import { isManager, isStaff } from '../common/AuthCheck';

const router = express.Router();

router.delete('/id/:eventID', isStaff,isManager, async (req, res) => {
  Event.findOneAndRemove({ eventId: req.params.eventID }).then(result => {
    if (!result) {
      return res.send({
        message: 'Invalid ID: ' + req.params.eventID
      });
    }
    const redirect = '/manage-events';
    const page = 'Manage Events';

    User.findOneAndUpdate(
      { username: res.locals.options.username },
      {
        $push: {
          history: {
            action: `Class Deleted: <a href="/event/id/${result.eventId}">${result.eventName}</a>`,
            time: Date.now()
          }
        }
      }
    ).then(() => res.send({
      message: 'Class with ' + result.eventId + ' removed.',
      redirect,
      page
    }));
  }).catch(err => {
    console.log(err);
    return res.send({
      message: 'Invalid ID: ' + req.params.eventID
    });
  });
});

export default router;