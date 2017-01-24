import GoLinksConstants from 'constants/goLinksConstants';

const defaultState = {

  // Some examples of store elements

  goLinksList: [],
  goLinksCreateForm: {
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
        goLinksCreateForm: {
          alias: { $set: action.alias }
        }
      });

    case GoLinksConstants.SET_URL:
      return update(state, {
        goLinksCreateForm: {
          url: { $set: action.url }
        }
      });

    case GoLinksConstants.SET_DESCRIPTION:
      return update(state, {
        goLinksCreateForm: {
          description: { $set: action.description }
        }
      });

    case GoLinksConstants.GO_LINKS_FETCH:
      return update(state, {
        goLinksFetchStatus: { $set: GoLinksConstants.GO_LINKS_FETCH_LOADING }
      });

    case GoLinksConstants.GO_LINKS_FETCH_SUCCESS:
      const newlyFetchedGoLinkList = {};
      _.each(action.data, function(goLink) {
        newlyFetchedGoLinkList[goLink.query.alias] = { url: goLink.query.url, description: goLink.query.description }
      });
      return update(state, {
        goLinksList: { $set: newlyFetchedGoLinkList },
        goLinksFetchStatus: { $set: action.type }
      });

    case GoLinksConstants.GO_LINKS_FETCH_FAILURE:
      return update(state, {
        goLinksFetchStatus: { $set: action.type }
      });

    default:
      return state;
  }
}

export default GoLinksReducer;
