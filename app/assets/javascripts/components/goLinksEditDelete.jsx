import GoLinksActions from 'actions/goLinksActions';
import AlertActions from 'actions/alertActions';
import AlertsConstants from 'constants/alertsConstants';
import { UiIcon } from 'liveramp-ui-toolkit';

var GoLinksEditDelete = React.createClass({
  render() {

    const { goLink, goLinksActions } = this.props;
    const editDeleteDisplayClass = this.getDisabledClass(goLink);

    return (
      <div>
        <UiIcon icon='edit'
          dimensions={[20, 20]}
          color='select-green'
          onClick={ () => { goLinksActions.populateEditInfo(goLink)
                            goLinksActions.redirect("/edit") } }
          classes={ editDeleteDisplayClass }
        />
        <UiIcon icon='trash'
          dimensions={[20, 20]}
          color='select-green'
          onClick={ () => { this.confirmDelete(goLink) } }
          classes={ editDeleteDisplayClass }
        />
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

  closeAlertAndDelete(goLink) {
    this.props.alertActions.closeAlert();
    this.props.goLinksActions.deleteGoLink(goLink);
  },

  getDisabledClass(goLink) {
    return goLink.ownedByUser ? "enabled" : "disabled";
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
