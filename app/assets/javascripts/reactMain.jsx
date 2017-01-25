import GoLinksAppReducer from 'reducers/goLinksAppReducer';
import GoLinksApp from './goLinksApp';
import GoLinksCreateForm from 'components/goLinksCreateForm';
import GoLinksEditForm from 'components/goLinksEditForm';
import GoLinksGlossaryTable from 'components/goLinksGlossaryTable';
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
          <IndexRoute component={GoLinksGlossaryTable}/>
          <Route path="create" component={GoLinksCreateForm}/>
          <Route path="edit" component={GoLinksEditForm}/>
          <Route path="*" component={GoLinksGlossaryTable}/>
        </Route>
      </Router>
    </ReactRedux.Provider>,
    document.getElementById('react-root')
  );
});
