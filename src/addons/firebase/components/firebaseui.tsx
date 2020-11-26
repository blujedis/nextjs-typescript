import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { auth } from 'firebaseui';
import firebase from 'firebase/app';
import 'firebase/auth';

import initFirebase from '../init';
import { setUserCookie } from '../utils/cookies';
import { mapUser } from '../utils/helpers';

// Init the Firebase app.
initFirebase();

// Auth providers
// https://github.com/firebase/firebaseui-web#configure-oauth-providers

const firebaseAuthConfig: auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  signInSuccessUrl: '/',
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: signInSuccessWithAuthResult as any,
  }
}

async function signInSuccessWithAuthResult({ user }: any, redirectUrl: string) {
  const userData = await mapUser(user);
  setUserCookie(userData);
}

const FirebaseAuth = () => {
  return (
    <StyledFirebaseAuth
      uiConfig={firebaseAuthConfig}
      firebaseAuth={firebase.auth()}
    />
  )
}

export default FirebaseAuth