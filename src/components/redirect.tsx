import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { UrlObject } from 'url';

export interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
}

export interface IRedirectProps {
  url: UrlObject | string;
  as?: UrlObject | string;
  options?: TransitionOptions;
  replace?: boolean;
}

function Redirect(props: IRedirectProps) {

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