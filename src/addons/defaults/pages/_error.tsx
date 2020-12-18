
import Link from 'next/link';
import { PageProps } from 'types';

function Error(props: PageProps) {

  const { statusCode, message } = props.err;

  const returnUrl = '/';
  const code = statusCode || 404;
  const borderColor = code === 404 ? 'rgba(0, 0, 0,.3)' : 'red';

  let msg = 'This page could not be found';
  msg = message || 'A server error has occurred';

  return (
    <div className="wrapper">

      <div className={code === 404 ? 'status status-404' : 'status'}>
        <h1>{code}</h1>
        <div className="text">
          <h2><span>{msg} </span>&nbsp;<Link href={returnUrl}>Return Home</Link></h2>
        </div>
      </div>

      <style jsx>{`

     .status-404 {
        color: cornflowerblue !important;
      }

      .status {
        color: red;
      }

      .wrapper {
        color:#000;
        background:#fff;
        font-family:-apple-system, BlinkMacSystemFont, Roboto, 'Segoe UI', 'Fira Sans', Avenir, 'Helvetica Neue', 'Lucida Grande', sans-serif;
        height:100vh;
        text-align:center;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
      }

      .text {
        display:inline-block;
        text-align:left;
        line-height:49px;
        height:49px;
        vertical-align:middle;
      }

      h1 {
        display:inline-block;
        border-right:1px solid ${borderColor};
        margin:0;
        margin-right:20px;
        padding:10px 23px 10px 0;
        font-size:24px;
        font-weight:500;
        vertical-align:top;
      }

      h2 {
        font-size:14px;
        font-weight:normal;
        line-height:inherit;
        margin:0;
        padding:0;
      }

    `}</style>

    </div>

  );

}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

  // return (
  //   <p>
  //     {statusCode
  //       ? `An error ${statusCode} occurred on server`
  //       : 'An error occurred on client'}
  //   </p>
  // );