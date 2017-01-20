import TaxonomyEndpointAppReducer from 'reducers/taxonomyEndpointAppReducer';
import TaxonomyEndpointApp from './taxonomyEndpointApp';
import TaxonomyEndpointList from 'components/taxonomyEndpointList';
import TaxonomyEndpointCreateForm from 'components/taxonomyEndpointCreateForm';
import TaxonomyEndpointShow from 'components/taxonomyEndpointShow';
import TaxonomyEndpointEditForm from 'components/taxonomyEndpointEditForm';
import getStore from 'reactUtils/getStore';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

$(function() {
  document.title = "Taxonomy Endpoint Admin";
  const store = getStore(TaxonomyEndpointAppReducer, 'reducers/taxonomyEndpointAppReducer');
  const history = syncHistoryWithStore(browserHistory, store);
  ReactDOM.render(
    <ReactRedux.Provider store={store}>
      <Router history={history}>
        <Route path="/" component={TaxonomyEndpointApp}>
          <IndexRoute component={TaxonomyEndpointList}/>
          <Route path="new" component={TaxonomyEndpointCreateForm}/>
          <Route path="/:id" component={TaxonomyEndpointShow}/>
          <Route path="/:id/edit" component={TaxonomyEndpointEditForm}/>
        </Route>
      </Router>
    </ReactRedux.Provider>,
    document.getElementById('react-root')
  );
});
