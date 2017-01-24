import AlertsConstants from 'constants/alertsConstants';
import GoLinksConstants from 'constants/goLinksConstants'
import AlertActions from 'actions/alertActions';
import { push } from 'react-router-redux';

const GoLinksActions = {
  redirect: (route) => {
    return (dispatch, getState) => {
      dispatch(push(route));
    }
  }
};

export default GoLinksActions;
