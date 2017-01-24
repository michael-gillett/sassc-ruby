import GoLinksActions from 'actions/goLinksActions';
import AlertActions from 'actions/alertActions';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksGlossaryTable from 'components/goLinksGlossaryTable';
import GoLinksCreateForm from 'components/goLinksCreateForm';
import { UiAlert, UiLoadingComponent } from 'liveramp-ui-toolkit';

const GoLinksApp = React.createClass({

  componentDidMount () {
    // this.props.taxonomyEndpointActions.fetchTaxonomyEndpoints();
  },

  render () {
    return (
      // <div className='col-xs-10 col-xs-offset-1'>
      //   { this.props.alerts.showing &&
      //     <UiAlert
      //       handleClose={this.props.alertActions.closeAlert}
      //       message={this.props.alerts.message}
      //       type={this.props.alerts.alertType}
      //       permanent={this.props.alerts.permanent}
      //     />
      //   }
      // </div>
      <div className='go-links-form-table'>
        { this.getBody() }
      </div>
    );
  },

  getBody() {
    // if (this.loadedEndpointsSuccessfully()) {
    //   return this.props.children;
    // } else if (this.failedToLoadEndpoints()) {
    //   return <UiLoadingComponent
    //     type='error'
    //     message={<p>{"Failed to load endpoints. Click to retry."}</p>}
    //     retryCallback={this.props.taxonomyEndpointActions.fetchTaxonomyEndpoints}
    //     />;
    // } else {
    //   return <UiLoadingComponent/>;
    // }
    return this.props.children;
  },

  // loadedEndpointsSuccessfully() {
  //   return this.props.taxonomyEndpoint.endpointFetchStatus === TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_SUCCESS;
  // },

  // failedToLoadEndpoints() {
  //   return this.props.taxonomyEndpoint.endpointFetchStatus === TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_FAILURE;
  // },

  // leaveTaxonomyEndpointUi () {
  //   window.location.href = TaxonomyEndpointConstants.ADMIN_URL;
  // },
});

const mapStateToProps = function(state) {
  return {
    alerts: state.alerts,
    goLinks: state.goLinks,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    goLinksActions: Redux.bindActionCreators(GoLinksActions, dispatch),
    alertActions: Redux.bindActionCreators(AlertActions, dispatch),
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksApp);
