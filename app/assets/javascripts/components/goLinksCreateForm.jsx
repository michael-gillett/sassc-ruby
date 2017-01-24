import { UiHeader, UiInput } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import AlertActions from 'actions/alertActions';

var GoLinksCreateForm = React.createClass ({

  render () {
    return (
      <div>
        <UiHeader
          textTitle="Go Links"
          helpText="go go go go go."
        />
        <button onClick={() => this.props.goLinksActions.redirect("/")} className="button">
          Back
        </button>
      </div>
    );
  }
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

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksCreateForm);
