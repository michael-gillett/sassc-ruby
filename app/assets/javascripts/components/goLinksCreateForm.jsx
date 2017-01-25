import { UiHeader, UiInput, UiIcon } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import GoLinksForm from 'components/goLinksForm';

var GoLinksCreateForm = React.createClass ({

  render () {
    return (
      <div className="form">
        <GoLinksForm />
        <div className="row">
          <button onClick={() => this.props.goLinksActions.redirect("/")} className="button">
            Back
          </button>
          <button onClick={() => {}} className="button">
            Save
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

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksCreateForm);
