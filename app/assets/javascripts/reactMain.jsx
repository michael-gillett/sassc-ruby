import GoLinksAppReducer from 'reducers/goLinksAppReducer';
import GoLinksApp from './goLinksApp';
import getStore from 'reactUtils/getStore';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

$(function() {
  document.title = "GoLinksApp";
  const store = getStore(GoLinksAppReducer, 'reducers/goLinksAppReducer');
  const history = syncHistoryWithStore(browserHistory, store);
  ReactDOM.render(
    <ReactRedux.Provider store={store}>
      <Router history={history}>
        <Route path="/" component={GoLinksApp}>
        </Route>
      </Router>
    </ReactRedux.Provider>,
    document.getElementById('react-root')
  );
});
