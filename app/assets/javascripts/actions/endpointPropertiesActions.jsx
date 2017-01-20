import TaxonomyEndpointConstants from 'constants/taxonomyEndpointConstants';

const EndpointPropertiesActions = {
  updateNameField: (id, name) => {
    return { type: TaxonomyEndpointConstants.UPDATE_REQUIRED_PROPERTY_NAME_FIELD, data: {id: id, name: name } };
  },

  updateDescriptionField: (id, description) => {
    return { type: TaxonomyEndpointConstants.UPDATE_REQUIRED_PROPERTY_DESCRIPTION_FIELD, data: { id: id, description: description } };
  },

  addNewProperty: () => {
    return { type: TaxonomyEndpointConstants.ADD_REQUIRED_PROPERTY_ROW };
  },

  deleteRow: (id) => {
    return { type: TaxonomyEndpointConstants.DELETE_REQUIRED_PROPERTY_ROW, id };
  },
};

export default EndpointPropertiesActions;
