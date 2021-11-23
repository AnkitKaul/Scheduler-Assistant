let err = new Error('Authorization Failed!!!!');
err.status = 401;

export function isSignedIn(req, res, next) {
  if (res.locals.options.type) 
  return next();
  return res.status(err.status).render('error_views/auth-error', {
    error: err.message,
    link: '/'
  });
}

export function isStaff(req, res, next) {
  if (res.locals.options.type === 'staff') 
  return next();
  return res.status(err.status).render('error_views/auth-error', {
    error: err.message,
    link: '/'
  });
}