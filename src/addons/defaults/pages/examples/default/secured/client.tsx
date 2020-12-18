import Layout from 'layout';
import { PageProps } from 'types';
import withGuard from 'components/with/withClientGuard';

function Secured(props: PageProps) {
  return (
    <Layout title="Secured Page Example" {...props}>
      <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.5rem' }}>
        If you see this, the Secured Guard component isn't working!!
      </p>
    </Layout>
  );
}

///////////////////////////////////////////////////////////
// Default Error Page
///////////////////////////////////////////////////////////

// Handler function returns statusCode
// This triggers an error and the default
// Error page is displayed.
//
const [SecuredPage, getServerSideProps] = withGuard(Secured, () => 401);

///////////////////////////////////////////////////////////
// Custom Page
///////////////////////////////////////////////////////////

// Similar to the above only we provide
// the helper with a custom page component.
//
// const CustomErrorPage = (props) => {
//   const div: CSSProperties = {
//     fontFamily: 'Helvetica Neue',
//     textAlign: 'center'
//   };
//   const title: CSSProperties = {
//     fontWeight: 'bold',
//     fontSize: '3rem',
//     color: 'red',
//     padding: '2rem'
//   };
//   const link: CSSProperties = {
//     fontSize: '1.5rem'
//   }
//   return (
//     <div style={div}>
//       <p style={title}>Some Custom Error Page</p>
//       <p style={link}>
//         <Link href="/">Return Home</Link>
//       </p>
//     </div>
//   );
// }
// const [SecuredPage, getServerSideProps] = withGuard(Secured, () => 401, CustomErrorPage);

///////////////////////////////////////////////////////////
// Redirect on Unauthorized
///////////////////////////////////////////////////////////

// Using the third argument you can redirect
// to a new page when auth hander returns status 
// 401 or 403. Here we're redirecting to the 
// home but you'd probably redirect to /signin or
// something to that effect.
//
// const [SecuredPage, getServerSideProps] = withGuard(Secured, () => 401, '/');

// This is the same as above except redirect props
// are supported. These are the same arguments you'd
// use if you were to use the Router hook so:
//
// const router = useRouter();
// router.push(...args) <-- these args but as an object. 
// see type IRedirectProps interface.
//
// const [SecuredPage, getServerSideProps] = withGuard(Secured, () => 401, { url: '/' });

export { getServerSideProps };

export default SecuredPage;
