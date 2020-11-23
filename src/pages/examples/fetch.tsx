import Layout from 'layout';
import Link from 'next/link';
import { PageProps } from 'types';
import useFetcher from 'hooks/fetcher';
import { useState } from 'react';

interface IUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  username: string;
  website: string;
  address: {
    city: string;
    street: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    }
  },
  company: {
    bs: string;
    catchPhrase: string;
    name: string;
  }
}

function Fetch(props: PageProps) {

  const { error, payload, isValidating } = useFetcher<IUser[]>('/api/examples/fetch');
  const [visible, setVisible] = useState(false);

  const loadUsers = () => {
    if (!payload || !payload.data || isValidating)
      return <span style={{ color: '#999' }}>Loading data...</span>
    if (error)
      return (
        <div>
          <div style={{ color: 'red', fontWeight: 'bold', marginBottom: '8px' }}>Server Error - {error.status}</div>
          {error.stack}
        </div>
      );

    // Don't show if we are showing code.
    if (visible)
      return null;

    return payload.data.map((user, i) => {
      return (
        <div key={i + 1} style={{ marginBottom: '12px', padding: '12px', boxShadow: ' 0 5px 5px rgba(182, 182, 182, 0.3)' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, position: 'relative' }}>
            <li style={{ marginBottom: '4px' }}>{user.name} <span style={{ position: 'absolute', right: '8px' }}>Id: {user.id}</span></li>
            <li style={{ marginBottom: '4px' }}>Phone: {user.phone}</li>
            <li style={{ marginBottom: '4px' }}>Email: {user.email}</li>
          </ul>
        </div>
      );
    });
  };

  return (
    <Layout title="Fetch Api Example" {...props}>
      <div style={{ maxWidth: 500, textAlign: 'center' }}>
        <h3>Fetch Api Example</h3>
        <p>This example demonstrates how to use the fetcher hook which uses <Link href="https://github.com/vercel/swr">Next's SWR underneath</Link></p>
        <p><Link href="/examples">Return to Examples</Link></p>
        <p style={{ marginTop: 24 }}>
          <button type="button" onClick={() => setVisible(!visible)}
            style={{ padding: '8px 14px', background: 'none', outline: 'none', border: '1px solid #ddd' }}>
            {!visible ? 'Show Code' : 'Show View'}
          </button>
        </p>
      </div>

      <div style={{ margin: '12px 0', width: '100%' }}>
        {loadUsers()}
      </div>

      { !visible ? null :

        <pre style={{ overflow: 'auto', width: '500px', border: '1px solid #ddd' }}>{`
          import useFetcher from 'hooks/fetcher';
          const {error, payload} = useFetcher<IUser>('/api/examples/fetch');

          // ABBREVIATED
          // Look at source for complete example.

          const loadUsers = () => {
            return payload.data.map((user, i) => {
              return (
                <div key={i + 1} style={{ marginBottom: '12px', padding: '12px', boxShadow: ' 0 5px 5px rgba(182, 182, 182, 0.3)' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, position: 'relative' }}>
                    <li style={{ marginBottom: '4px' }}>{user.name} <span style={{ position: 'absolute', right: '8px' }}>Id: {user.id}</span></li>
                    <li style={{ marginBottom: '4px' }}>Phone: {user.phone}</li>
                    <li style={{ marginBottom: '4px' }}>Email: {user.email}</li>
                  </ul>
                </div>
              );
            });
          };

          <div style={{ margin: '12px 0', width: '100%' }}>
            {loadUsers()}
          </div>

        `}
        </pre>
      }

    </Layout>

  );

}

export default Fetch;