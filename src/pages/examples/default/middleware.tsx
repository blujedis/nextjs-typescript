import Layout from 'layout';
import Link from 'next/link';
import { PageProps } from 'types';
import useFetcher from 'hooks/fetcher';
import { useState } from 'react';

function Fetch(props: PageProps) {

  const { error, payload, isValidating } = useFetcher<string[]>('/api/examples/middleware');
  const [visible, setVisible] = useState(false);

  return (
    <Layout title="Middleware Api Example" {...props}>
      <div style={{ maxWidth: 500, textAlign: 'center' }}>
        <h3>Middleware API Example</h3>
        <p>This example demonstrates how to use middleware hook which uses <Link href="https://github.com/vercel/swr">Next's SWR underneath</Link></p>
        <p><Link href="/examples">Return to Examples</Link></p>
        <p style={{ marginTop: 24 }}>
          <button type="button" onClick={() => setVisible(!visible)}
            style={{ padding: '8px 14px', background: 'none', outline: 'none', border: '1px solid #ddd' }}>
            {!visible ? 'Show Code' : 'Show View'}
          </button>
        </p>
      </div>

      <div style={{ margin: '12px 0', width: 500 }}>
        {payload.data}
      </div>

      { !visible ? null :

        <pre style={{ overflow: 'auto', width: '500px', border: '1px solid #ddd' }}>{`
        import createHandler from 'middleware';

        const handler = createHandler();
        
        handler.get((req, res) => {
        
          res.send('Hello Middleware using request id: ' + req.rid);
        
        });
        `}
        </pre>
      }

    </Layout>

  );

}

export default Fetch;