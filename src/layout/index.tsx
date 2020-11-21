import { PropsWithChildren } from 'react';
import LayoutDefault from './default';
import { ILayoutBase } from './types';

const LAYOUT_MAP = {
  default: LayoutDefault
};

function Layout(props: PropsWithChildren<ILayoutBase>) {

  props = {
    name: 'default',
    ...props
  };

  const LayoutComponent = LAYOUT_MAP[props.name];

  if (!LayoutComponent)
    throw new Error(`Invalid Layout name "${props.name || 'unknown'}".`);

  return <LayoutComponent {...props} />;

}

export default Layout;