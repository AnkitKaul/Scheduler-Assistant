import express from 'express';
import Event from '../../models/event';
import registerRouter from './register';
import signInRouter from './sign-in';
import bookedRouter from './booked';
import manageRouter from './manage';
import { parseEvents } from '../common/ParserClass';
import { isSignedIn } from '../common/AuthCheck';
import User from '../../models/user';

const router = express.Router();

router.use('/', registerRouter);
router.use('/', signInRouter);
router.use('/', bookedRouter);
router.use('/', manageRouter);

router.get('/', async (req, res) => {
  try{
    let username = res.locals.options.username;
    let options = {};
    if (username){
      const user = await User.findOne({username});
      options.branch = user.branch;
    }
    const result = await Event.find(options).where('startDate').gt(new Date()).sort('startDate');
    let events = parseEvents(result);
    res.locals.options.page = 'home';
    res.locals.options.events = events;
    res.render('index', res.locals.options); 
  }
  catch(err){
    console.log(err);
  }
});

router.get('/sign-out', isSignedIn, (req, res, next) => {
  if (res.locals.options.username) {
    req.session.destroy(err => {
      if (err) return next(err);
      return res.redirect('/');
    });
  }
});

export default router;