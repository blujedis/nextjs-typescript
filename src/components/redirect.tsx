import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { IRedirectProps } from 'types';

function Redirect<P>(props: IRedirectProps & P) {

  const { url, as, options, replace } = props;

  const router = useRouter();

  useEffect(() => {
    if (replace)
      router.replace(url, as, options);
    else
      router.push(url, as, options);
  }, []);

  // Must return something here or
  // you won't have a valid component.
  return null;

}

export default Redirect;