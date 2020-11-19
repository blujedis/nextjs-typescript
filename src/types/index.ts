import { FC, Component, ReactElement } from 'react';
import { Router } from 'next/router';

export type ErrorProps<Ext extends { statusCode?: number } = { statusCode?: number; }> = Error & Ext;

export type PageProps<P = {}> = { err?: ErrorProps } & P;

export interface IApp<P extends Object = {}> {
  Component: FC | typeof Component;
  err: ErrorProps;
  pageProps: P;
  router: Router;
}
