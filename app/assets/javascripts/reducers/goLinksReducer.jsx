import GoLinksConstants from 'constants/goLinksConstants';

const defaultState = {

  // Some examples of store elements
  goLinksList: [],
  newGoLinkData: {
    alias: "",
    url: "",
    description: "",
  },
  goLinksFetchStatus: GoLinksConstants.GO_LINKS_FETCH_LOADING
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

    case GoLinksConstants.GO_LINKS_FETCH:
      return update(state, {
        goLinksFetchStatus: { $set: GoLinksConstants.GO_LINKS_FETCH_LOADING }
      });

    case GoLinksConstants.GO_LINKS_FETCH_SUCCESS:
      const newlyFetchedGoLinkList = [];
      _.each(action.data, function(goLink) {
        newlyFetchedGoLinkList.push({ id: goLink.query.alias, alias: goLink.query.alias, url: goLink.query.url, description: goLink.query.description, owner: goLink.query.owner });
      });
      return update(state, {
        goLinksList: { $set: newlyFetchedGoLinkList },
        goLinksFetchStatus: { $set: action.type }
      });

    case GoLinksConstants.GO_LINKS_FETCH_FAILURE:
      return update(state, {
        goLinksFetchStatus: { $set: action.type }
      });

    case GoLinksConstants.POPULATE_EDIT_INFO:
      return update(state, {
        newGoLinkData: {
          alias: { $set: action.goLink.alias },
          url: { $set: action.goLink.url },
          description: { $set: action.goLink.description }
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
