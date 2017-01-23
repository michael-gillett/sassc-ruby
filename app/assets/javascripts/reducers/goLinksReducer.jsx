import GoLinksConstants from 'constants/goLinksConstants';

const defaultState = {

  // Some examples of store elements

  // originalEndpointList: {}, // looks like an object filled with newEndpointData referenced by id: { 1: newEndpointData{}, 2: newEndpointData{}}
  // goLinks: {
  //   someId: null,
  //   someName: "",
  //   segmentBodyFormat: "",
  //   protocol: "",
  //   status: "",
  //   thriftModel: {},
  //   protocolAttributes: {},
  //   requiredTaxonomyProperties: {},
  //   detailsFetchStatus: "",
  //   savingStatus: "", // only present in newEndpointData
  // },
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

    default:
      return state;
  }
}

export default GoLinksReducer;
