import GoLinksActions from 'actions/goLinksActions';
import AlertActions from 'actions/alertActions';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksGlossaryTable from 'components/goLinksGlossaryTable';
import GoLinksCreateForm from 'components/goLinksCreateForm';
import { UiAlert, UiLoadingComponent } from 'liveramp-ui-toolkit';

const GoLinksApp = React.createClass({

  componentDidMount () {
    this.props.goLinksActions.fetchGoLinks();
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
    if (this.loadedGoLinksSuccessfully()) {
      return this.props.children;
    } else if (this.failedToLoadGoLinks()) {
      return <UiLoadingComponent
        type='error'
        message={<p>{"Failed to load go links. Click to retry."}</p>}
        retryCallback={this.props.goLinksActions.fetchGoLinks}
        />;
    } else {
      return <UiLoadingComponent/>;
    }
    return this.props.children;
  },

  loadedGoLinksSuccessfully() {
    return this.props.goLinks.goLinksFetchStatus === GoLinksConstants.GO_LINKS_FETCH_SUCCESS;
  },

  failedToLoadGoLinks() {
    return this.props.goLinks.goLinksFetchStatus === GoLinksConstants.GO_LINKS_FETCH_FAILURE;
  }

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
