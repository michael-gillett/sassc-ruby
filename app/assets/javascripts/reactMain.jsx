import GoLinksAppReducer from 'reducers/taxonomyEndpointAppReducer';
import GoLinksApp from './taxonomyEndpointApp';
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
          // <IndexRoute component={TaxonomyEndpointList}/>
          // <Route path="new" component={TaxonomyEndpointCreateForm}/>
          // <Route path="/:id" component={TaxonomyEndpointShow}/>
          // <Route path="/:id/edit" component={TaxonomyEndpointEditForm}/>
        </Route>
      </Router>
    </ReactRedux.Provider>,
    document.getElementById('react-root')
  );
});
