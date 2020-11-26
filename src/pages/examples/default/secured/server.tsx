import Layout from 'layout';
import { PageProps } from 'types';
import withGuard from 'components/with/withServerGuard';

function ServerSecured(props: PageProps) {
  return (
    <Layout title="Secured Page Example" {...props}>
      <p style={{ color: 'red', fontWeight: 'bold', fontSize: '1.5rem' }}>
        If you see this, the Secured Guard component isn't working!!
      </p>
    </Layout>
  );
}

const [SecuredPage, getServerSideProps] = withGuard(ServerSecured, () => 401, '/');

export { getServerSideProps };

export default SecuredPage;
