import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {

  providers: [

    Providers.GitHub({
      clientId: process.env.NEXTAUTH_GITHUB_ID,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET
    }),

    // Providers.Apple({
    //   clientId: process.env.APPLE_ID,
    //   clientSecret: process.env.APPLE_SECRET
    // }),

    // Sign in with passwordless email link
    //
    // Providers.Email({
    //   server: process.env.MAIL_SERVER,
    //   from: '<no-reply@example.com>'
    // }),

    // Providers.Google({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET
    // })

  ],
  // SQL or MongoDB database (or leave empty)
  // database: process.env.NEXTAUTH_DATABASE_URL

}

export default (req, res) => NextAuth(req, res, options);