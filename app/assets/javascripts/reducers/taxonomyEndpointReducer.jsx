import TaxonomyEndpointConstants from 'constants/taxonomyEndpointConstants';

const defaultState = {

  originalEndpointList: {}, // looks like an object filled with newEndpointData referenced by id: { 1: newEndpointData{}, 2: newEndpointData{}}
  newEndpointData: {
    id: null,
    name: "",
    segmentBodyFormat: "",
    protocol: "",
    status: "",
    thriftModel: {},
    protocolAttributes: {},
    requiredTaxonomyProperties: {},
    detailsFetchStatus: "",
    savingStatus: "", // only present in newEndpointData
  },

  endpointFetchStatus: TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_LOADING,
  searchInputValue: "",
};

const newEndpointDataWithPropertyIds = (requiredTaxonomyProperties, newPropertyIds) => {
  _.each(requiredTaxonomyProperties, (property) => {
    if (!property.id) {
      property.id = newPropertyIds[property.name];
      property.key = newPropertyIds[property.name];
    }
    property.editMode = false;
  });
  return requiredTaxonomyProperties;
}

const mergeNewEndpointData = (originalEndpointList, newEndpoint, action) => {
  newEndpoint.detailsFetchStatus = TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_SUCCESS;
  newEndpoint.requiredTaxonomyProperties = newEndpointDataWithPropertyIds(newEndpoint.requiredTaxonomyProperties, action.newPropertyIds);
  newEndpoint.savingStatus = action.type;
  newEndpoint.id = action.data.endpoint.id;
  originalEndpointList[action.data.endpoint.id] = newEndpoint;
  return originalEndpointList;
}

const greatestRowKey = (properties) => {
  let greatestKey = 0;
  _.each(properties, (property) => {
    if (property.key > greatestKey) {
      greatestKey = property.key;
    }
  });
  return greatestKey;
}

function TaxonomyEndpointsReducer(state = defaultState, action) {

  switch (action.type) {
    case TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH:
      return update(state, {
        endpointFetchStatus: { $set: TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_LOADING }
      });

    case TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_FAILURE:
      return update(state, {
        endpointFetchStatus: { $set: action.type }
      });

    case TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_SUCCESS:
      const newlyFetchedEndpointList = {};
      _.each(action.data, function(endpoint) {
        newlyFetchedEndpointList[endpoint.id] = { id: endpoint.id, name: endpoint.name }
      });
      return update(state, {
        endpointFetchStatus: { $set: action.type },
        originalEndpointList: { $set: newlyFetchedEndpointList }
      });

    case TaxonomyEndpointConstants.UPDATING:
    case TaxonomyEndpointConstants.UPDATING_FAILURE:
      return update(state, {
        newEndpointData: { savingStatus: { $set: action.type } }
      });

    case TaxonomyEndpointConstants.UPDATING_SUCCESS:
      const originalEndpointListUponUpdate = update(state.originalEndpointList, {});
      const newEndpointDataUponUpdate = update(state.newEndpointData, {});
      return update(state, {
        originalEndpointList: { $set: mergeNewEndpointData(originalEndpointListUponUpdate, newEndpointDataUponUpdate, action) },
        newEndpointData: { $set: defaultState.newEndpointData }
      });

    case TaxonomyEndpointConstants.UPDATE_NAME_FIELD:
      return update(state, {
        newEndpointData: { name: { $set: action.newName } }
      });

    case TaxonomyEndpointConstants.UPDATE_SEGMENT_BODY_FORMAT_FIELD:
      return update(state, {
        newEndpointData: { segmentBodyFormat: { $set: action.newFormat } }
      });

    case TaxonomyEndpointConstants.CREATING:
    case TaxonomyEndpointConstants.CREATING_FAILURE:
      return update(state, {
        newEndpointData: { savingStatus: { $set: action.type } }
      });

    case TaxonomyEndpointConstants.CREATING_SUCCESS:
      const originalEndpointListUponCreate = update(state.originalEndpointList, {});
      const newEndpointDataUponCreate = update(state.newEndpointData, {});
      return update(state, {
        originalEndpointList: { $set: mergeNewEndpointData(originalEndpointListUponCreate, newEndpointDataUponCreate, action) },
        newEndpointData: { $set: defaultState.newEndpointData }
      });

    case TaxonomyEndpointConstants.CANCEL_ENDPOINT_EDIT:
    case TaxonomyEndpointConstants.CANCEL_ENDPOINT_CREATE:
      return update(state, {
        newEndpointData: { $set: defaultState.newEndpointData }
      });

    case TaxonomyEndpointConstants.UPDATE_REQUIRED_PROPERTY_NAME_FIELD:
      return update(state, {
        newEndpointData: { requiredTaxonomyProperties: { [action.data.id]: { name: { $set: action.data.name } } } }
      });

    case TaxonomyEndpointConstants.UPDATE_REQUIRED_PROPERTY_DESCRIPTION_FIELD:
      return update(state, {
        newEndpointData: { requiredTaxonomyProperties: { [action.data.id]: { description: { $set: action.data.description } } } }
      });

    case TaxonomyEndpointConstants.UPDATE_REQUIRED_PROPERTY_EDIT_MODE:
      return update(state, {
        newEndpointData: { requiredTaxonomyProperties: { [action.data.id]: { editMode: { $set: action.data.editMode } } } }
      });

    case TaxonomyEndpointConstants.DELETE_REQUIRED_PROPERTY_ROW:
      const filteredRequiredPropertiesList = {};
      _.each(state.newEndpointData.requiredTaxonomyProperties, (requiredTaxonomyProperty) => {
        if (parseInt(requiredTaxonomyProperty.key) !== action.id) {
          filteredRequiredPropertiesList[requiredTaxonomyProperty.key] = requiredTaxonomyProperty;
        }
      });
      return update(state, {
        newEndpointData: { requiredTaxonomyProperties: { $set: filteredRequiredPropertiesList } }
      });

    case TaxonomyEndpointConstants.ADD_REQUIRED_PROPERTY_ROW:
      const newPropertyRow = {};
      const key = greatestRowKey(state.newEndpointData.requiredTaxonomyProperties) + 1;
      newPropertyRow[key] = {
        key: key,
        id: undefined,
        name: "",
        description: "",
        editMode: true
      };
      return update(state, {
        newEndpointData: { requiredTaxonomyProperties: { $merge: newPropertyRow } }
      });

    case TaxonomyEndpointConstants.UPDATE_THRIFT_DATA:
      return update(state, {
        newEndpointData: { protocolAttributes: { $set: action.newState } }
      });

    case TaxonomyEndpointConstants.UPDATE_SELECTED_STRUCT:
      return update(state, {
        newEndpointData: { protocol: { $set: action.newStruct } }
      });

    case TaxonomyEndpointConstants.THRIFT_STRUCT_FETCH:
      return update(state, {
        structFetchStatus: { $set: action.type },
        newEndpointData: {
          protocol: { $set: action.newStruct },
          thriftModel: { $set: {} }
        }
      });

    case TaxonomyEndpointConstants.THRIFT_STRUCT_FETCH_SUCCESS:
      return update(state, {
        structFetchStatus: { $set: action.type },
        newEndpointData: { thriftModel: { $set: action.model } }
      });

    case TaxonomyEndpointConstants.THRIFT_STRUCT_FETCH_FAILURE:
      return update(state, {
        structFetchStatus: { $set: action.type }
      });

    case TaxonomyEndpointConstants.UPDATE_SEARCH_INPUT:
      return update(state, {
        searchInputValue: { $set: action.searchInputValue }
      });

    case TaxonomyEndpointConstants.DELETE_ENDPOINT:
      return update(state, {
        originalEndpointList: { [action.endpointId]: { status: { $set: TaxonomyEndpointConstants.DELETE_ENDPOINT_LOADING } } }
      });

    case TaxonomyEndpointConstants.DELETE_ENDPOINT_FAILURE:
      return update(state, {
        originalEndpointList: { [action.endpointId]: { status: { $set: action.type } } }
      });

    case TaxonomyEndpointConstants.DELETE_ENDPOINT_SUCCESS:
      const endpointListAfterDeleting = update(state.originalEndpointList, {});
      delete endpointListAfterDeleting[action.endpointId];
      return update(state, {
        originalEndpointList: { $set: endpointListAfterDeleting }
      });

    case TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH:
    case TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_FAILURE:
      return update(state, {
        originalEndpointList: { [action.id]: { detailsFetchStatus: { $set: action.type } } }
      });

    case TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_SUCCESS:
      const propertiesListUponFetchSuccess = {};
      _.each(action.data.required_properties, function(properties) {
        propertiesListUponFetchSuccess[properties.id] = {
          editMode: false,
          key: properties.id,
          id: properties.id,
          name: properties.property_name,
          description: properties.description,
        };
      });
      return update(state, {
        originalEndpointList: { [action.id]: {
          requiredTaxonomyProperties: { $set: propertiesListUponFetchSuccess },
          detailsFetchStatus: { $set: action.type },
          protocol: { $set: action.data.protocol_key },
          segmentBodyFormat: { $set: action.data.segment_body_format },
          thriftModel: { $set: action.data.thrift_model },
          protocolAttributes: { $set: action.data.protocol_attributes },
        } },
        newEndpointData: {
          requiredTaxonomyProperties: { $set: propertiesListUponFetchSuccess },
          detailsFetchStatus: { $set: action.type },
          protocol: { $set: action.data.protocol_key },
          segmentBodyFormat: { $set: action.data.segment_body_format },
          thriftModel: { $set: action.data.thrift_model },
          protocolAttributes: { $set: action.data.protocol_attributes },
        }
      });

    case TaxonomyEndpointConstants.CLICK_EDIT_BUTTON:
      const originalEndpointListUponClickEdit = update(state.originalEndpointList, {});
      return update(state, {
        newEndpointData: { $set: originalEndpointListUponClickEdit[action.id] }
      });

    default:
      return state;
  }
}

export default TaxonomyEndpointsReducer;
