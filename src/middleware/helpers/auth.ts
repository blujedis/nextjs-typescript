import { Middleware } from '../';

// we already parsed our user/token
// in earlier middleware so here we just
// check for the user and any roles
// that are specified.

export const isAuthenticated = (): Middleware<void> => {
  return (req, res, next) => {

    // Example: 
    // If you have "user" on your request object you 
    // can check if exists.

    if (!req.user)
      return res.unauthenticated(`This resource requires authentication.`);

    next();
  };
};

export const isAuthorized = (...roles: any[]): Middleware<void> => {
  return (req, res, next) => {

    // Example: 
    // If you have "user" on your request object you 
    // can check if exists.

    if (!req.user)
      return res.unauthenticated(`This resource requires authentication.`);

    next();
  };
};