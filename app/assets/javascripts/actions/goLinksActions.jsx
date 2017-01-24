import AlertsConstants from 'constants/alertsConstants';
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
