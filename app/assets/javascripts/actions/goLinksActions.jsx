import AlertsConstants from 'constants/alertsConstants';
import GoLinksConstants from 'constants/goLinksConstants';
import XhrStatusConstants from 'constants/xhrStatusConstants';
import AlertActions from 'actions/alertActions';
import { push } from 'react-router-redux';

const GoLinksActions = {
  setAlias: (alias) => {
    return { type: GoLinksConstants.SET_ALIAS, alias };
  },

  setUrl: (url) => {
    return { type: GoLinksConstants.SET_URL, url };
  },

  setDescription: (description) => {
    return { type: GoLinksConstants.SET_DESCRIPTION, description };
  },

  populateEditInfo: (goLink) => {
    return { type: GoLinksConstants.POPULATE_EDIT_INFO, goLink };
  },

  populateAliasInfo: (aliasName) => {
    const alias = aliasName.replace('/', "");
    return { type: GoLinksConstants.POPULATE_ALIAS_INFO, alias };
  },

  clearEditInfo: () => {
    return { type: GoLinksConstants.CLEAR_EDIT_INFO };
  },

  fetchGoLinks: () => {
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.GO_LINKS_FETCH });
      $.ajax({
        url: '/api/go_links',
        type: 'GET',
        success (data) {
          dispatch({ type: XhrStatusConstants.GO_LINKS_SUCCESS, data });
        },
        error (error) {
          dispatch({ type: XhrStatusConstants.GO_LINKS_FAILURE });
        }
      });
    };
  },

  updateGoLink: (goLink) => {
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.GO_LINK_UPDATING });
      $.ajax({
        url: '/api/go_links/' + goLink.alias,
        type: 'PATCH',
        data: goLink,
        success (data) {
          dispatch({ type: XhrStatusConstants.UPDATE_SUCCESS, data });
          dispatch(AlertActions.openAlert(AlertsConstants.ALERT_TYPES.SUCCESS, "Go/ Link updated successfully!"));
          dispatch(push(`${data.redirect_to}`));
        },
        error (error) {
          dispatch(AlertActions.openAlert(AlertsConstants.ALERT_TYPES.ERROR, "Go/ Link failed to update. Try again."));
          dispatch({ type: XhrStatusConstants.UPDATE_FAILURE });
        }
      });
    };
  },

  redirect: (route) => {
    return push(route);
  },

};

export default GoLinksActions;
