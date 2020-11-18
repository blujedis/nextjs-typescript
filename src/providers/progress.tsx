/**
 * Adds progress bar at top of page on any fetch.
 */

import Router from 'next/router';
import NProgress from 'nprogress';

let timer;
let state;
let activeRequests = 0;
const delay = 250;

function load() {
  if (state === 'loading')
    return;
  state = 'loading';
  timer = setTimeout(function () {
    NProgress.start();
  }, delay); // only show if longer than the delay
}

function stop() {
  if (activeRequests > 0)
    return;
  state = 'stop';
  clearTimeout(timer);
  NProgress.done();
}

Router.events.on('routeChangeStart', load);
Router.events.on('routeChangeComplete', stop);
Router.events.on('routeChangeError', stop);

const _fetch = window.fetch;

window.fetch = async function (...args) {

  if (activeRequests === 0)
    load();

  activeRequests++;

  try {
    return _fetch(...args);
  }
  catch (ex) {
    return Promise.reject(ex);
  }
  finally {
    activeRequests -= 1;
    if (activeRequests === 0)
      stop();
  }

};

export default function ProgressDummy() {
  return null;
};