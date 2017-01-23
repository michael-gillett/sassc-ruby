import AlertReducer from 'reducers/alertReducer';
import GoLinksReducer from 'reducers/goLinksReducer';
import { routerReducer } from 'react-router-redux';

const GoLinksAppReducer = Redux.combineReducers({
  alerts: AlertReducer,
  routing: routerReducer,
  goLinks: GoLinksReducer,
});

export default GoLinksAppReducer;
