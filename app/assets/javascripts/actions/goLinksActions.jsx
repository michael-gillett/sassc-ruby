import AlertsConstants from 'constants/alertsConstants';
import GoLinksConstants from 'constants/goLinksConstants';
import AlertActions from 'actions/alertActions';
import { push } from 'react-router-redux';

const GoLinksActions = {
  setAlias: (alias) => {
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.SET_ALIAS, alias });
    }
  },
  setUrl: (url) => {
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.SET_URL, url });
    }
  },
  setDescription: (description) => {
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.SET_DESCRIPTION, description });
    }
  },

  redirect: (route) => {
    return (dispatch, getState) => {
      dispatch(push(route));
    }
  }
};

export default GoLinksActions;
