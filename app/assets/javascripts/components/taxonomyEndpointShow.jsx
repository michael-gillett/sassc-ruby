import { UiHeader, UiLoadingComponent } from 'liveramp-ui-toolkit';
import TaxonomyEndpointConstants from 'constants/taxonomyEndpointConstants';
import EndpointInfo from 'components/endpointInfo';
import EndpointConfig from 'components/endpointConfig';
import EndpointProperties from 'components/endpointProperties';
import TaxonomyEndpointActions from 'actions/taxonomyEndpointActions';

var TaxonomyEndpointShow = React.createClass ({

  componentDidMount () {
    this.reload();
  },

  render () {
    return (
      <div>
        <UiHeader
          textTitle="View Taxonomy Endpoint"
          helpText="Here's where you can view a taxonomy endpoint."
          />
        { this.getBody() }
      </div>
    );
  },

  getBody() {
    if (this.loadedDetailsSuccessfully()) {
      const thisEndpoint = this.props.taxonomyEndpoint.originalEndpointList[this.props.routeParams.id];
      return (
        <div>
          <EndpointInfo
            editMode={false}
            name={thisEndpoint.name}
            format={thisEndpoint.segmentBodyFormat}
            />
          <EndpointConfig
            editMode={false}
            updateThriftData={this.props.taxonomyEndpointActions.updateThriftData}
            fetchSelectedStruct={this.props.taxonomyEndpointActions.fetchSelectedStruct}
            options={gon.protocol_list}
            protocol={thisEndpoint.protocol}
            structFields={thisEndpoint.thriftModel}
            protocolAttributes={thisEndpoint.protocolAttributes}
            updateValidStatus={this.setThriftValid}
            />
          <EndpointProperties
            properties={this.props.taxonomyEndpoint.originalEndpointList[this.props.routeParams.id]["requiredTaxonomyProperties"]}
            editMode={false}
            />
          <button onClick={this.onClickEditButton} className="button">
            Edit
          </button>
          <button onClick={this.onClickHomeButton} className="button dark">
            Home
          </button>
        </div>
      );
    } else if (this.failedToLoadDetails()) {
      return <UiLoadingComponent
        type='error'
        message={<p>{"Failed to load endpoint details. Click to retry."}</p>}
        retryCallback={this.reload}
        />;
    } else {
      return <UiLoadingComponent/>;
    }
  },

  loadedDetailsSuccessfully() {
    return this.props.taxonomyEndpoint.originalEndpointList[this.props.routeParams.id].detailsFetchStatus === TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_SUCCESS;
  },

  failedToLoadDetails() {
    return this.props.taxonomyEndpoint.originalEndpointList[this.props.routeParams.id].detailsFetchStatus === TaxonomyEndpointConstants.ENDPOINT_DETAILS_FETCH_FAILURE;
  },

  onClickEditButton() {
    this.props.taxonomyEndpointActions.clickEditButton(this.props.routeParams.id);
    this.props.taxonomyEndpointActions.redirect(`/${this.props.routeParams.id}/edit`);
  },

  onClickHomeButton() {
    this.props.taxonomyEndpointActions.redirect("/");
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
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TaxonomyEndpointShow);
