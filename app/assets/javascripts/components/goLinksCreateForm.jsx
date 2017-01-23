import { UiHeader, UiInput } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';

var GoLinksCreateForm = React.createClass ({

  getInitialState() {
    //
  },

  render () {
    return (
      <div>
        <UiHeader
          textTitle="New Taxonomy Endpoint"
          helpText="Here's where you can create a taxonomy endpoint."
        />
      { this.getBody() }
      </div>
    );
  },

  getBody() {
    const expandButton = <button className="button success">Show Macros</button>;
    const collapseButton = <button className="button success">Hide Macros</button>;
    return (
      <div>
        <EndpointInfo
          editMode={true}
          updateNameField={this.props.taxonomyEndpointActions.updateNameField}
          updateFormatField={this.props.taxonomyEndpointActions.updateFormatField}
          name={this.props.taxonomyEndpoint.newEndpointData.name}
          nameValid={this.isNameValid()}
          format={this.props.taxonomyEndpoint.newEndpointData.segmentBodyFormat}
          formatValid={this.isFormatValid()}
          showMacros={this.state.showMacros}
          expandButton={expandButton}
          collapseButton={collapseButton}
          macroTable={<MacroTable macroList={gon.macros} />}
          />
        <EndpointConfig
          editMode={true}
          updateThriftData={this.props.taxonomyEndpointActions.updateThriftData}
          fetchSelectedStruct={this.props.taxonomyEndpointActions.fetchSelectedStruct}
          options={gon.protocol_list}
          protocol={this.props.taxonomyEndpoint.newEndpointData.protocol}
          structFields={this.props.taxonomyEndpoint.newEndpointData.thriftModel}
          protocolAttributes={this.props.taxonomyEndpoint.newEndpointData.protocolAttributes}
          updateValidStatus={this.setThriftValid}
          />
        <EndpointProperties
          editMode={true}
          properties={this.props.taxonomyEndpoint.newEndpointData.requiredTaxonomyProperties}
          actions={this.props.endpointPropertiesActions}
          />
        { this.getButtons() }
      </div>
    );
  },

  getButtons() {
    if (this.isCreating()) {
      return <UiLoadingComponent/>;
    } else {
      return (
        <div>
          <button onClick={this.onSubmit} className="button" disabled={!this.isValid()}>
            Save
          </button>
          <button onClick={this.props.taxonomyEndpointActions.cancelEndpointCreate} className="button dark">
            Cancel
          </button>
        </div>
      );
    }
  },

  setThriftValid(newStatus) {
    this.setState({ thriftValid: newStatus });
  },

  onSubmit(event) {
    if (this.isValid()) {
      this.props.taxonomyEndpointActions.create();
    }
  },

  isValid() {
    let allPropertyFieldsPresent = true;
    let propertyNames = [];
    var key, property;
    _.each(this.props.taxonomyEndpoint.newEndpointData.requiredTaxonomyProperties, (property) => {
      if (!property.name || !property.description) {
        allPropertyFieldsPresent = false;
      }
      propertyNames.push(property.name);
    });
    return (
      allPropertyFieldsPresent &&
      _.uniq(propertyNames).length === propertyNames.length &&
      this.isNameValid() &&
      this.isFormatValid() &&
      this.state.thriftValid
    );
  },

  isNameValid() {
    return !!this.props.taxonomyEndpoint.newEndpointData.name;
  },

  isFormatValid() {
    return !!this.props.taxonomyEndpoint.newEndpointData.segmentBodyFormat;
  },

  isCreating() {
    return this.props.taxonomyEndpoint.newEndpointData.savingStatus === TaxonomyEndpointConstants.CREATING;
  },

});

const mapStateToProps = (state) => {
  return {
    goLinks: state.goLinks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    goLinksActions: Redux.bindActionCreators(GoLinksActions, dispatch)
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksCreateForm);
