import { createRestash, logger, applyMiddleware, IRestashOptions } from 'restash';

const IS_DEV = process.env.IS_DEV;

const _initialState = {};

type InitialState = typeof _initialState;
const initialState = _initialState as InitialState;

const middleware = IS_DEV ? applyMiddleware(logger()) : null;

const options: IRestashOptions<InitialState> = {
  initialState,
  middleware,
  persistent: '__app_store__',
  // persistentKeys: [],
  ssrKey: true
};

const { Provider, useStore, clearPersistence } = createRestash(options);

export {
  Provider,
  useStore,
  clearPersistence
};
