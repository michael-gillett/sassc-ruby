import GoLinksConstants from 'constants/goLinksConstants';
import AlertsConstants from 'constants/alertsConstants';
import XhrStatusConstants from 'constants/xhrStatusConstants';

const defaultState = {
  goLinksList: {},
  filteredGoLinksList: {},
  newGoLinkData: {
    alias: "",
    url: GoLinksConstants.DEFAULT_URL_PREFIX,
    description: "",
    owner: "",
  },
  goLinksFetchStatus: XhrStatusConstants.GO_LINKS.LOADING,
  goLinkSaveStatus: "",
  goLinkDeleteStatus: "",
  queryParams: GoLinksConstants.DEFAULT_QUERY_PARAMS,
}

const updateGoLinksList = (originalGoLinksList, updatedGoLink) => {
  updatedGoLink["ownedByUser"] = true;
  const goLinkIndex = originalGoLinksList.map(function(link) {return link.alias;}).indexOf(updatedGoLink.alias);

  if (goLinkIndex > -1) { // update
    originalGoLinksList[goLinkIndex] = updatedGoLink;
  } else { // create
    originalGoLinksList.unshift(updatedGoLink);
  }

  return originalGoLinksList;
}

const deleteFromGoLinksList = (originalGoLinksList, deletedGoLink) => {
  const deletedGoLinkIndex = originalGoLinksList.map(function(link) {return link.alias;}).indexOf(deletedGoLink.alias);
  originalGoLinksList.splice(deletedGoLinkIndex, 1);
  return originalGoLinksList;
}

const filterGoLinksListByOwner = (list, ownerFilter, GoLinksConstants) => {
  if (ownerFilter == GoLinksConstants.FILTER_OWNER_MY_LINKS) {
    var filtered = _.filter(_.values(list), function(element) {
      return element.ownedByUser
    });
    return filtered;
  } else {
    return list;
  }
}

const filterGoLinksListBySearch = (list, search_query) => {
  if (search_query.length == 0) {
    return list;
  } else {
    var filtered = _.filter(_.values(list), function(element) {
      return element.alias.includes(search_query) || element.url.includes(search_query) || element.description.includes(search_query);
    });
    return filtered;
  }
}

const filterGoLinksList = (goLinksList, queryParams, GoLinksConstants) => {
  var list = filterGoLinksListByOwner(goLinksList, queryParams.owner, GoLinksConstants);
  return filterGoLinksListBySearch(list, queryParams.search_query);
}

function GoLinksReducer(state = defaultState, action) {
  switch (action.type) {
    case GoLinksConstants.SET_ALIAS:
      return update(state, {
        newGoLinkData: {
          alias: { $set: action.alias },
          owner: { $set: gon.active_user } // this needs to be done somewhere for link creation
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

    case GoLinksConstants.QUERY_PARAMS_UPDATED:
      return update(state, {
        queryParams: { $merge: action.params },
      });

    case GoLinksConstants.UPDATE_FILTERED_LIST:
      return update(state, {
        filteredGoLinksList: { $set: filterGoLinksList(state.goLinksList, state.queryParams, GoLinksConstants) }
      });

    case GoLinksConstants.GO_LINKS_FETCH:
      return update(state, {
        goLinksFetchStatus: { $set: XhrStatusConstants.GO_LINKS.LOADING }
      });

    case XhrStatusConstants.GO_LINKS.SUCCESS:
      const newlyFetchedGoLinkList = [];
      var sortedList = _.sortBy(action.data, function(link) { return link.alias; });
      _.each(sortedList, function(goLink) {
        newlyFetchedGoLinkList.push( { id: goLink.alias,
                                       alias: goLink.alias,
                                       url: goLink.url,
                                       description: goLink.description,
                                       owner: goLink.owner,
                                       ownedByUser: (gon.active_user == goLink.owner) || gon.is_admin_user }
                                    );
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
          description: { $set: action.goLink.description },
          owner: { $set: action.goLink.owner }
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
          url: {  $set: GoLinksConstants.DEFAULT_URL_PREFIX },
          description: {  $set: "" }
        }
      });

    default:
      return state;
  }
}

export default GoLinksReducer;
