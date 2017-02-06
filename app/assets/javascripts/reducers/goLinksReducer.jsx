import GoLinksConstants from 'constants/goLinksConstants';
import AlertsConstants from 'constants/alertsConstants';
import XhrStatusConstants from 'constants/xhrStatusConstants';

const defaultState = {
  goLinksList: {},
  filteredGoLinksList: {},
  newGoLinkData: {
    alias: "",
    url: "",
    description: "",
  },
  goLinksFetchStatus: XhrStatusConstants.GO_LINKS.LOADING,
  goLinkSaveStatus: "",
  goLinkDeleteStatus: "",
  searchValue: "",
}

const updateGoLinksList = (originalGoLinksList, updatedGoLink) => {
  originalGoLinksList[updatedGoLink.alias] = updatedGoLink;
  return originalGoLinksList;
}

const deleteFromGoLinksList = (originalGoLinksList, deletedGoLink) => {
  const updatedGoLinksList = _.omit(originalGoLinksList, deletedGoLink.alias);
  return updatedGoLinksList;
}

function GoLinksReducer(state = defaultState, action) {
  switch (action.type) {
    case GoLinksConstants.SET_ALIAS:
      return update(state, {
        newGoLinkData: {
          alias: { $set: action.alias }
        }
      });

    case GoLinksConstants.SET_URL:
      return update(state, {
        newGoLinkData: {
          url: { $set: action.url }
        }
      });

    case GoLinksConstants.SET_DESCRIPTION:
      return update(state, {
        newGoLinkData: {
          description: { $set: action.description }
        }
      });

    case GoLinksConstants.UPDATE_SEARCH:
      var filtered = _.filter(_.values(state.goLinksList), function(element) {
        return element.alias.includes(action.searchValue) || element.url.includes(action.searchValue) || element.description.includes(action.searchValue);
      });
      return update(state, {
        searchValue: { $set: action.searchValue },
        filteredGoLinksList: { $set: filtered }
      });

    case GoLinksConstants.GO_LINKS_FETCH:
      return update(state, {
        goLinksFetchStatus: { $set: XhrStatusConstants.GO_LINKS.LOADING }
      });

    case XhrStatusConstants.GO_LINKS.SUCCESS:
      const newlyFetchedGoLinkList = [];
      _.each(action.data, function(goLink) {
        newlyFetchedGoLinkList[goLink.query.alias] = { id: goLink.query.alias, alias: goLink.query.alias, url: goLink.query.url, description: goLink.query.description, owner: goLink.query.owner };
      });
      return update(state, {
        goLinksList: { $set: newlyFetchedGoLinkList },
        filteredGoLinksList: { $set: newlyFetchedGoLinkList },
        goLinksFetchStatus: { $set: action.type },
      });

    case XhrStatusConstants.GO_LINKS.FAILURE:
      return update(state, {
        goLinksFetchStatus: { $set: action.type }
      });

    case GoLinksConstants.GO_LINK_UPDATING:
    case XhrStatusConstants.UPDATE.FAILURE:
      return update(state, {
        goLinkSaveStatus: { $set: action.state }
      });

    case XhrStatusConstants.UPDATE.SUCCESS:
      const newlyUpdatedGoLink = action.data.go_link
      return update(state, {
        goLinksList: { $set: updateGoLinksList(state.goLinksList, newlyUpdatedGoLink) },
        newGoLinkData: { $set: defaultState.newGoLinkData },
        goLinkSaveStatus: { $set: defaultState.goLinkSaveStatus }
      });

    case GoLinksConstants.GO_LINK_SAVING:
    case XhrStatusConstants.SAVE.FAILURE:
      return update(state, {
        goLinkSaveStatus: { $set: action.state }
      });

    case XhrStatusConstants.SAVE.SUCCESS:
      const newGoLink = action.data.go_link
      const updatedList = updateGoLinksList(state.goLinksList, newGoLink)
      return update(state, {
        goLinksList: { $set: updatedList },
        filteredGoLinksList: { $set: updatedList },
        newGoLinkData: { $set: defaultState.newGoLinkData },
        goLinkSaveStatus: { $set: defaultState.goLinkSaveStatus }
      });

    case GoLinksConstants.GO_LINK_DELETING:
    case XhrStatusConstants.DELETE.FAILURE:
      return update(state, {
        goLinkDeleteStatus: { $set: action.state }
      });

    case XhrStatusConstants.DELETE.SUCCESS:
      const deletedGoLink = action.data.go_link
      const deletedUpdateList = deleteFromGoLinksList(state.goLinksList, deletedGoLink)
      return update(state, {
        goLinksList: { $set: deletedUpdateList },
        filteredGoLinksList: { $set: deletedUpdateList },
        newGoLinkData: { $set: defaultState.newGoLinkData },
        goLinkDeleteStatus: { $set: defaultState.goLinkDeleteStatus }
      });

    case GoLinksConstants.POPULATE_EDIT_INFO:
      return update(state, {
        newGoLinkData: {
          alias: { $set: action.goLink.alias },
          url: { $set: action.goLink.url },
          description: { $set: action.goLink.description }
        }
      });

    case GoLinksConstants.POPULATE_ALIAS_INFO:
      return update(state, {
        newGoLinkData: {
          alias: { $set: action.alias }
        }
      });

    case GoLinksConstants.CLEAR_EDIT_INFO:
      return update(state, {
        newGoLinkData: {
          alias: { $set: "" },
          url: {  $set: "" },
          description: {  $set: "" }
        }
      });

    default:
      return state;
  }
}

export default GoLinksReducer;
