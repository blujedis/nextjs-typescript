import Layout from 'layout';
import { PageProps } from 'types';
import withGuard from 'with/withGuard';
import initRoles, { RoleKey } from 'utils/roles';

function Roles(props: PageProps) {
  return (
    <Layout title="Create Next App" {...props}>
      <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.5rem' }}>
        If you see this, the Roles Guard component isn't working!!
      </p>
    </Layout>
  );
}

///////////////////////////////////////////////////////////
// Show Error when User Doesn't Have Role
///////////////////////////////////////////////////////////

// The arrays for each key allow you to include 
// any other role. The role manager will expand
// these when you use the "authorize" helper in
// the role manager.

const ROLES_MAP = {
  user: [],
  manager: ['user'],
  admin: ['manager']
};

const roleManger = initRoles(ROLES_MAP);

// Let's create a mock user.

const user = {
  firstName: 'Milton',
  lastName: 'Waddams',
  email: 'milton.waddams@mail.com',
  roles: ['manager'] as RoleKey<typeof ROLES_MAP>[] // assign correct type or your'll get a complaint.
};

// Handler function returns statusCode
// This triggers an error and the default
// Error page is displayed if user doesn't have
// required roles.

// We'll simulate a fetch call.
const authUser = (ctx) => {

  // Next context is passed to us, you'll
  // probably have your user on the req but 
  // in our case we've just defined statically.
  //
  // ex: ctx.req.user; or something like that :)

  return roleManger
    .authorize('admin', user.roles)
    .allowAnon()
    .verifyUnauthorized();

};


const [SecuredPage, getServerSideProps] = withGuard(Roles, authUser);

export { getServerSideProps };

export default SecuredPage;
