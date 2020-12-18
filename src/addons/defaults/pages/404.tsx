
import { ErrorProps, PageProps } from 'types';
import ErrorPage from './_error';

export default function NotFound(props: PageProps) {
  const err = new Error(`The requested page was not found`) as ErrorProps;
  err.statusCode = 404;
  return <ErrorPage err={err} />
};