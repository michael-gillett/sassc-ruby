import AlertsConstants from 'constants/alertsConstants';
import GoLinksConstants from 'constants/goLinksConstants'
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

  populateEditInfo: (goLink) => {
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.POPULATE_EDIT_INFO, goLink });
    }
  },

  populateAliasInfo: (aliasName) => {
    const alias = aliasName.replace('/', "");
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.POPULATE_ALIAS_INFO, alias });
    }
  },

  clearEditInfo: () => {
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.CLEAR_EDIT_INFO });
    }
  },

  fetchGoLinks: () => {
    return (dispatch, getState) => {
      dispatch({ type: GoLinksConstants.GO_LINKS_FETCH });
      $.ajax({
        url: '/api/go_links',
        type: 'GET',
        success (data) {
          dispatch({ type: GoLinksConstants.GO_LINKS_FETCH_SUCCESS, data });
        },
        error (error) {
          dispatch({ type: GoLinksConstants.GO_LINKS_FETCH_FAILURE });
        }
      });
    };
  },

  redirect: (route) => {
    return (dispatch, getState) => {
      dispatch(push(route));
    }
  },

};

export default GoLinksActions;
