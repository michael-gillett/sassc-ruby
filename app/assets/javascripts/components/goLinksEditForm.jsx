import { UiHeader, UiInput, UiIcon } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import ValidURL from 'valid-url';
import GoLinksForm from 'components/goLinksForm';

var GoLinksEditForm = React.createClass ({

  render () {
    return (
      <div className="form">
        <GoLinksForm />
        <div className="row">
          <button onClick={() => { this.props.goLinksActions.clearEditInfo()
                                   this.props.goLinksActions.redirect("/") }} className="button">
            Back
          </button>
          <button onClick={() => { this.props.goLinksActions.updateGoLink(this.props.goLinks.newGoLinkData) }} className="button">
            Edit
          </button>
        </div>
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
    goLinksActions: Redux.bindActionCreators(GoLinksActions, dispatch)
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksEditForm);
