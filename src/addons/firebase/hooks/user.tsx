import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import 'firebase/auth';

import initFirebase from '../init';

import {
  removeUserCookie,
  setUserCookie,
  getUserCookie,
} from '../utils/cookies';

import { mapUser } from '../utils/helpers';

initFirebase()

const useUser = () => {
  
  const [user, setUser] = useState(null as any)
  const router = useRouter()

  const signOut = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.push('/auth')
      })
      .catch((e) => {
        console.error(e)
      });
  }

  useEffect(() => {

    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async (user) => {

        if (user) {
          const userData = await mapUser(user);
          setUserCookie(userData);
          setUser(userData);
        } 
        else {
          removeUserCookie();
          setUser(null);
        }
      });

    const userFromCookie = getUserCookie();

    if (!userFromCookie) {
      router.push('/');
      return;
    }

    setUser(userFromCookie);

    return () => {
      cancelAuthListener();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { user, signOut };

}

export default useUser;