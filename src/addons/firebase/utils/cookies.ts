import cookies from 'js-cookie';

export const getUserCookie = () => {
  const cookie = cookies.get('auth');
  if (!cookie)
    return;
  return JSON.parse(cookie);
}

// Firebase id tokens expire in one hour
// set cookie expiry to match
export const setUserCookie = (user, expires = 1 / 24) => {
  cookies.set('auth', user, {
    expires
  });
}

export const removeUserCookie = () => cookies.remove('auth');