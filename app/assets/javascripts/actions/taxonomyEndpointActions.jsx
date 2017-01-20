import TaxonomyEndpointConstants from 'constants/taxonomyEndpointConstants';
import AlertsConstants from 'constants/alertsConstants';
import AlertActions from 'actions/alertActions';
import { push } from 'react-router-redux';
import DebugHelper from 'helpers/debugHelper';

const TaxonomyEndpointActions = {

  fetchTaxonomyEndpoints: () => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH});
      $.ajax({
        url: '/api/taxonomy_endpoints',
        type: 'GET',
        success (data) {
          dispatch({ type: TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_SUCCESS, data });
        },
        error (error) {
          DebugHelper.logInternalStackTrace(error.responseJSON);
          dispatch({ type: TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_FAILURE });
        }
      });
    };
  },

  fetchEndpointDetails: (id) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH, id: id });
      $.ajax({
        url: '/api/taxonomy_endpoints/' + id,
        type: 'GET',
        success (data) {
          dispatch({ type: TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_SUCCESS, id: id, data });
        },
        error (error) {
          DebugHelper.logInternalStackTrace(error.responseJSON);
          dispatch({ type: TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_FAILURE, id: id });
        }
      });
    };
  },

  create: () => {
    return (dispatch, getState) => {
      const newEndpointData = getState().taxonomyEndpoint.newEndpointData;
      const data = {
        name: newEndpointData.name,
        selectedProtocol: newEndpointData.protocol,
        protocolAttributes: newEndpointData.protocolAttributes,
        segmentBodyFormat: newEndpointData.segmentBodyFormat,
        requiredProperties: newEndpointData.requiredTaxonomyProperties,
      };
      dispatch({ type: TaxonomyEndpointConstants.CREATING });
      $.ajax({
        url: '/api/taxonomy_endpoints/',
        type: 'POST',
        data: data,
        success(data) {
          const newPropertyIds = {};
          _.each(data.endpoint.new_required_properties, (property) => {
            newPropertyIds[property.property_name] = property.id;
          });
          dispatch({ type: TaxonomyEndpointConstants.CREATING_SUCCESS, data: data, newPropertyIds });
          dispatch(AlertActions.openAlert(AlertsConstants.ALERT_TYPES.SUCCESS, "New endpoint saved successfully"));
          dispatch(push(`${data.redirect_to}`));
        },
        error(error) {
          DebugHelper.logInternalStackTrace(error.responseJSON);
          dispatch(AlertActions.openAlert(AlertsConstants.ALERT_TYPES.ERROR, "Failed to create endpoint. Check the JavaScript console for a full stack trace."));
          dispatch({ type: TaxonomyEndpointConstants.CREATING_FAILURE });
        }
      });
    }
  },

  update: (id) => {
    return (dispatch, getState) => {
      const newEndpointData = getState().taxonomyEndpoint.newEndpointData;
      const data = {
        id: id,
        name: newEndpointData.name,
        selectedProtocol: newEndpointData.protocol,
        protocolAttributes: newEndpointData.protocolAttributes,
        segmentBodyFormat: newEndpointData.segmentBodyFormat,
        newRequiredProperties: newEndpointData.requiredTaxonomyProperties,
        originalRequiredProperties: getState().taxonomyEndpoint.originalEndpointList[id].requiredTaxonomyProperties,
      };
      dispatch({ type: TaxonomyEndpointConstants.UPDATING });
      $.ajax({
        url: '/api/taxonomy_endpoints/' + data.id,
        type: 'PATCH',
        data: data,
        success(data) {
          const newPropertyIds = {};
          _.each(data.endpoint.new_required_properties, (property) => {
            newPropertyIds[property.property_name] = property.id;
          });
          dispatch({ type: TaxonomyEndpointConstants.UPDATING_SUCCESS, data: data, newPropertyIds });
          dispatch(AlertActions.openAlert(AlertsConstants.ALERT_TYPES.SUCCESS, "Endpoint updated successfully"));
          dispatch(push(`${data.redirect_to}`));
        },
        error(error) {
          DebugHelper.logInternalStackTrace(error.responseJSON);
          dispatch(AlertActions.openAlert(AlertsConstants.ALERT_TYPES.ERROR, "Failed to update endpoint. Check the JavaScript console for a full stack trace."));
          dispatch({ type: TaxonomyEndpointConstants.UPDATING_FAILURE });
        }
      });
    }
  },

  redirect: (route) => {
    return (dispatch, getState) => {
      dispatch(push(route));
    }
  },

  cancelEndpointEdit: (endpointShowUrl) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.CANCEL_ENDPOINT_EDIT });
      dispatch(push(endpointShowUrl));
    }
  },

  cancelEndpointCreate: () => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.CANCEL_ENDPOINT_CREATE });
      dispatch(push(`/`));
    }
  },

  updateRequiredPropertiesNameField: (id, name) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.UPDATE_REQUIRED_PROPERTY_NAME_FIELD, data: {id: id, name: name} });
    }
  },

  updateRequiredPropertiesDescriptionField: (id, description) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.UPDATE_REQUIRED_PROPERTY_DESCRIPTION_FIELD, data: {id: id, description: description} });
    }
  },

  updateRequiredPropertiesEditMode: (id, editMode) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.UPDATE_REQUIRED_PROPERTY_EDIT_MODE, data: {id: id, editMode: editMode} });
    }
  },

  deleteRow: (id) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.DELETE_REQUIRED_PROPERTY_ROW, data: {id: id} });
    }
  },

  addNewRequiredProperty: (key) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.ADD_REQUIRED_PROPERTY_ROW, data: {key: key} });
    }
  },

  updateSearchInput: (searchInputValue) => {
    return { type: TaxonomyEndpointConstants.UPDATE_SEARCH_INPUT, searchInputValue };
  },

  deleteEndpoint: (endpointId) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.DELETE_ENDPOINT, endpointId });
      $.ajax({
        url: '/api/taxonomy_endpoints/' + endpointId,
        type: 'DELETE',
        success(data) {
          dispatch({ type: TaxonomyEndpointConstants.DELETE_ENDPOINT_SUCCESS, endpointId });
          dispatch(AlertActions.openAlert(AlertsConstants.ALERT_TYPES.SUCCESS, "Endpoint deleted successfully"));
        },
        error(data) {
          DebugHelper.logInternalStackTrace(error.responseJSON);
          dispatch({ type: TaxonomyEndpointConstants.DELETE_ENDPOINT_FAILURE, endpointId: endpointId });
          dispatch(AlertActions.openAlert(AlertsConstants.ALERT_TYPES.ERROR, "Failed to delete endpoint"));
        }
      });
    }
  },

  clickEditButton: (endpointId) => {
    return { type: TaxonomyEndpointConstants.CLICK_EDIT_BUTTON, id: endpointId };
  },

  updateNameField: (newName) => {
    return { type: TaxonomyEndpointConstants.UPDATE_NAME_FIELD, newName };
  },

  updateFormatField: (newFormat) => {
    return { type: TaxonomyEndpointConstants.UPDATE_SEGMENT_BODY_FORMAT_FIELD, newFormat };
  },

  updateThriftData: (newState) => {
    return { type: TaxonomyEndpointConstants.UPDATE_THRIFT_DATA, newState };
  },

  fetchSelectedStruct: (newStruct) => {
    return (dispatch, getState) => {
      dispatch({ type: TaxonomyEndpointConstants.THRIFT_STRUCT_FETCH, newStruct});
      $.ajax({
        url: '/api/protocol_struct',
        type: 'GET',
        data: { structKey: newStruct },
        success (model) {
          dispatch({ type: TaxonomyEndpointConstants.THRIFT_STRUCT_FETCH_SUCCESS, model });
        },
        error (error) {
          DebugHelper.logInternalStackTrace(error.responseJSON);
          dispatch({ type: TaxonomyEndpointConstants.THRIFT_STRUCT_FETCH_FAILURE, error });
        }
      });
    };
  },

};

export default TaxonomyEndpointActions;
