import { FC, Component } from 'react';
import { Router } from 'next/router';

export type Page<Props extends Object = IPage> = Props & IPage;

export interface IApp {
  Component: FC | typeof Component;
  err: Error;
  pageProps: Object;
  router: Router;
}

export interface ILayout {
  name?: string;
  title?: string;
  subtitle?: string;
}

export interface IPage {
  err?: Error;
  router?: Router;
}