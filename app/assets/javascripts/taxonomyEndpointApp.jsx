import TaxonomyEndpointActions from 'actions/taxonomyEndpointActions';
import AlertActions from 'actions/alertActions';
import TaxonomyEndpointConstants from 'constants/taxonomyEndpointConstants';
import { UiAlert, UiLoadingComponent } from 'liveramp-ui-toolkit';

const TaxonomyEndpointApp = React.createClass({

  componentDidMount () {
    this.props.taxonomyEndpointActions.fetchTaxonomyEndpoints();
  },

  render () {
    return (
      <div className='col-xs-10 col-xs-offset-1'>
        { this.props.alerts.showing &&
          <UiAlert
            handleClose={this.props.alertActions.closeAlert}
            message={this.props.alerts.message}
            type={this.props.alerts.alertType}
            permanent={this.props.alerts.permanent}
          />
        }
        { this.getBody() }
      </div>
    );
  },

  getBody() {
    if (this.loadedEndpointsSuccessfully()) {
      return this.props.children;
    } else if (this.failedToLoadEndpoints()) {
      return <UiLoadingComponent
        type='error'
        message={<p>{"Failed to load endpoints. Click to retry."}</p>}
        retryCallback={this.props.taxonomyEndpointActions.fetchTaxonomyEndpoints}
        />;
    } else {
      return <UiLoadingComponent/>;
    }
  },

  loadedEndpointsSuccessfully() {
    return this.props.taxonomyEndpoint.endpointFetchStatus === TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_SUCCESS;
  },

  failedToLoadEndpoints() {
    return this.props.taxonomyEndpoint.endpointFetchStatus === TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_FAILURE;
  },

  leaveTaxonomyEndpointUi () {
    window.location.href = TaxonomyEndpointConstants.ADMIN_URL;
  },
});

const mapStateToProps = function(state) {
  return {
    alerts: state.alerts,
    taxonomyEndpoint: state.taxonomyEndpoint,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    taxonomyEndpointActions: Redux.bindActionCreators(TaxonomyEndpointActions, dispatch),
    alertActions: Redux.bindActionCreators(AlertActions, dispatch),
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TaxonomyEndpointApp);
