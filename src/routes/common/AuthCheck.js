import Event from '../../models/event';
let err = new Error('Authorization Failed!!!!');
err.status = 401;

export function isSignedIn(req, res, next) {
  if (res.locals.options.type) return next();
  // Not authorized
  return res.status(err.status).render('error_views/auth-error', {
    error: err.message,
    link: '/'
  });
}

export function isStaff(req, res, next) {
  if (res.locals.options.type === 'staff') return next();
  // Not authorized
  return res.status(err.status).render('error_views/auth-error', {
    error: err.message,
    link: '/'
  });
}

export async function isManager(req,res,next) {
  let event = await Event.findOne({ eventId: req.params.eventID });
  if (event.manager_username === res.locals.options.username) return next();
  return res.status(err.status).render('error_views/auth-error', {
    error: err.message,
    link: '/'
  });
};