import { Button, ButtonGroup } from 'react-bootstrap';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import GoLinksForm from 'components/goLinksForm';

var GoLinksCreateForm = React.createClass ({

  render () {
    return (
      <div className="container">
        <GoLinksForm />
        <div className="row">
          <ButtonGroup>
            <Button type="submit" onClick={() => this.props.goLinksActions.redirect("/")} >
              Cancel
            </Button>
            <Button type="submit" onClick={() => {}} >
              Save
            </Button>
          </ButtonGroup>
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
