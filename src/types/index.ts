import { FC, Component } from 'react';
import { Router } from 'next/router';
import { UrlObject } from 'url';

export type ErrorProps<Ext extends { statusCode?: number } = { statusCode?: number; }> = Error & Ext;

export type PageProps<P = Record<string, any>> = { err?: ErrorProps } & P;

export interface IApp<P extends Record<string, any> = Record<string, any>> {
  Component: FC | typeof Component;
  err: ErrorProps;
  pageProps: PageProps<P>;
  router: Router;
}

export interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
}

export type Url = UrlObject | string;

export interface IRedirectProps {
  url: Url;
  as?: Url;
  replace?: boolean;
  options?: TransitionOptions;
  [key: string]: any;
}
