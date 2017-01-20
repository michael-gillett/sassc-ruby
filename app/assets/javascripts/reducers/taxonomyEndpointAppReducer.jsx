import AlertReducer from 'reducers/alertReducer';
import TaxonomyEndpointReducer from 'reducers/taxonomyEndpointReducer';
import { routerReducer } from 'react-router-redux';

const TaxonomyEndpointAppReducer = Redux.combineReducers({
  alerts: AlertReducer,
  routing: routerReducer,
  taxonomyEndpoint: TaxonomyEndpointReducer,
});

export default TaxonomyEndpointAppReducer;
