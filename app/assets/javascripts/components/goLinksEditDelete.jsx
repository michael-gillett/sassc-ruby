import GoLinksActions from 'actions/goLinksActions';
import AlertActions from 'actions/alertActions';
import AlertsConstants from 'constants/alertsConstants';
import { UiIcon } from 'liveramp-ui-toolkit';

var GoLinksEditDelete = React.createClass({
  render() {

    const { goLink } = this.props;

    return (
      <div>
        <UiIcon icon='edit' dimensions={[20, 20]} color='select-green' onClick={() => { this.props.goLinksActions.populateEditInfo(this.props.goLink)
                                                                                        this.props.goLinksActions.redirect("/edit") } }/>
        <UiIcon icon='trash' dimensions={[20, 20]} color='select-green' onClick={ () => { this.confirmDelete(this.props.goLink) }}/>
      </div>
    );
  },

  confirmDelete(goLink) {
    const message = (
      <p>Are you sure you want to delete go/{goLink.alias}?
        <span onClick={ this.closeAlertAndDelete.bind(null, goLink) } className='delete-go-link-confirmation'>
        &nbsp; Click <strong>here</strong> to delete.
        </span>
      </p>
    );
    return this.props.alertActions.openAlert(AlertsConstants.ALERT_TYPES.ERROR, message, true);
  },

  closeAlertAndDelete (goLink) {
    this.props.alertActions.closeAlert();
    this.props.goLinksActions.deleteGoLink(goLink);
  },

});

const mapStateToProps = function(state) {
  return {
    goLinks: state.goLinks,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    goLinksActions: Redux.bindActionCreators(GoLinksActions, dispatch),
    alertActions: Redux.bindActionCreators(AlertActions, dispatch),
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksEditDelete);
