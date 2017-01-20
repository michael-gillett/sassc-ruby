import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux'
import createLogger from 'redux-logger';

const getStore = (reducer, reducerPath) => {
  const middlewares = [thunk, routerMiddleware(browserHistory)];
  let store;
  if (gon.env === 'development') {
    // Require statement needed by webpack for hot loading even though we never make
    // use of the variable.
    const css = require('style-loader!css-loader!sass-loader?includePaths[]=./node_modules/compass-mixins/lib!custom.sass');
    const logger = createLogger();
    middlewares.push(logger);

    store = Redux.createStore(
      reducer,
      Redux.compose(Redux.applyMiddleware(...middlewares),
        window.devToolsExtension ? window.devToolsExtension() : f => f)
    );

    // Required by newer versions of redux to hot reload reducers properly
    if (module && module.hot) {
      module.hot.accept(reducerPath, () => {
        store.replaceReducer(reducer);
      });
    }

  } else {
    store = Redux.createStore(
      reducer,
      Redux.applyMiddleware(...middlewares)
    );
  }
  return store;
};

export default getStore;
