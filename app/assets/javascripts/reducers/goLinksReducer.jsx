import GoLinksConstants from 'constants/goLinksConstants';

const defaultState = {

  // Some examples of store elements

  goLinksList: [], // looks like an object filled with newEndpointData referenced by id: { 1: newEndpointData{}, 2: newEndpointData{}}
  goLinksCreateForm: {
    alias: "",
    url: "",
    description: "",
  },
}

function GoLinksReducer(state = defaultState, action) {

  switch (action.type) {
    // Examples:

    // case GoLinksConstants.SOME_STATE:
    //   return update(state, {
    //     someStoreElement: { $set: GoLinksConstants.TRIGGER_SOME_OTHER_STATE }
    //   });

    // case GoLinksConstants.SOME_STATE:
    //   return update(state, {
    //     someStoreElement: { $set: action.type }
    //   });
    
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
    default:
      return state;
  }
}

export default GoLinksReducer;
