import { UiHeader, UiLoadingComponent } from 'liveramp-ui-toolkit';
import TaxonomyEndpointConstants from 'constants/taxonomyEndpointConstants';
import MacroTable from './macroTable';
import EndpointInfo from 'components/endpointInfo';
import EndpointConfig from 'components/endpointConfig';
import EndpointProperties from 'components/endpointProperties';
import TaxonomyEndpointActions from 'actions/taxonomyEndpointActions';
import EndpointPropertiesActions from 'actions/endpointPropertiesActions';

var TaxonomyEndpointEditForm = React.createClass ({

  getInitialState() {
    return { thriftValid: true, showMacros: false };
  },

  componentDidMount () {
    if (!this.isValid()) {
      this.props.taxonomyEndpointActions.clickEditButton(this.props.routeParams.id);
    }
    this.reload();
  },

  render () {
    return (
      <div>
        <UiHeader
          textTitle="Edit Taxonomy Endpoint"
          helpText="Here's where you can edit a taxonomy endpoint."
          />
        { this.getBody() }
      </div>
    );
  },

  getBody() {
    if (this.loadedDetailsSuccessfully()) {
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
    } else if (this.failedToLoadDetails()) {
      return <UiLoadingComponent
        type='error'
        message={<p>{"Failed to load endpoint details. Click to retry."}</p>}
        retryCallback={this.reload}
        />;
    } else {
      return <UiLoadingComponent/>
    }
  },

  getButtons() {
    if (this.isSaving()) {
      return <UiLoadingComponent/>;
    } else {
      return (
        <div>
          <button onClick={this.onSubmit} className="button" disabled={!this.isValid()}>
            Save
          </button>
          <button onClick={() => this.props.taxonomyEndpointActions.cancelEndpointEdit(`/${this.props.routeParams.id}`)} className="button dark">
            Cancel
          </button>
        </div>
      );
    }
  },

  hasUnsavedChanges() {
    return (
      this.props.taxonomyEndpoint.newEndpointData.name !== undefined &&
      this.props.taxonomyEndpoint.newEndpointData.name !== this.props.taxonomyEndpoint.originalEndpointList[this.props.routeParams.id].name
    );
  },

  getDisplayName() {
    if (this.props.taxonomyEndpoint.newEndpointData.name === "") {
      return "";
    }
    return this.props.taxonomyEndpoint.newEndpointData.name || this.props.taxonomyEndpoint.originalEndpointList[this.props.routeParams.id].name
  },

  onSubmit(event) {
    if (this.isValid()) {
      this.props.taxonomyEndpointActions.update(this.props.routeParams.id);
    }
  },

  setThriftValid(newStatus) {
    this.setState( {thriftValid: newStatus} );
  },

  isValid() {
    let propertyNames = [];
    const allFieldsPresent = _.every(this.props.taxonomyEndpoint.newEndpointData.requiredTaxonomyProperties, (property) => {
      propertyNames.push(property.name);
      return property.name && property.description;
    });
    return (
      allFieldsPresent &&
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

  isSaving() {
    return this.props.taxonomyEndpoint.newEndpointData.savingStatus === TaxonomyEndpointConstants.UPDATING;
  },

  loadedDetailsSuccessfully() {
    return this.props.taxonomyEndpoint.originalEndpointList[this.props.routeParams.id].detailsFetchStatus === TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_SUCCESS;
  },

  failedToLoadDetails() {
    return this.props.taxonomyEndpoint.originalEndpointList[this.props.routeParams.id].detailsFetchStatus === TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_FAILURE;
  },

  reload() {
    if (!this.loadedDetailsSuccessfully()) {
      this.props.taxonomyEndpointActions.fetchEndpointDetails(this.props.routeParams.id);
    }
  },

});

const mapStateToProps = (state) => {
  return {
    taxonomyEndpoint: state.taxonomyEndpoint,
    routing: state.routing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    taxonomyEndpointActions: Redux.bindActionCreators(TaxonomyEndpointActions, dispatch),
    endpointPropertiesActions: Redux.bindActionCreators(EndpointPropertiesActions, dispatch),
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TaxonomyEndpointEditForm);
