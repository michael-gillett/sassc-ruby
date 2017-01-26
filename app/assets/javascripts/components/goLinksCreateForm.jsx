import { Button, ButtonGroup, Col, PageHeader } from 'react-bootstrap';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import GoLinksForm from 'components/goLinksForm';

var GoLinksCreateForm = React.createClass ({

  render () {
    return (
      <Col
        id="main-container"
        lg={8}
        lgOffset={2}
        md={10}
        mdOffset={1}
        sm={12}
      >
        <PageHeader><strong>Create a go/ link</strong></PageHeader>
        <GoLinksForm />
        <div className="row">
          <ButtonGroup bsSize="large">
            <Button type="submit" onClick={() => this.props.goLinksActions.redirect("/")} >
              Cancel
            </Button>
            <Button type="submit" onClick={() => {}} >
              Save
            </Button>
          </ButtonGroup>
        </div>
      </Col>
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
