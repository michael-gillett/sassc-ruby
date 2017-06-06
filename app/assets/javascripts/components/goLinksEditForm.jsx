import { Col, PageHeader } from 'react-bootstrap';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import ValidURL from 'valid-url';
import GoLinksForm from 'components/goLinksForm';

var GoLinksEditForm = React.createClass ({

  render () {
    const { goLinksActions, goLinks } = this.props;

    return (
      <Col
        id="main-container"
        lg={8}
        lgOffset={2}
        md={10}
        mdOffset={1}
        sm={12}
      >
        <PageHeader><strong>Edit go/ link.</strong></PageHeader>
        <GoLinksForm
          submitButtonText="Save"
          submitButtonAction={() => { goLinksActions.updateGoLink(goLinks.newGoLinkData) }}
          disableAliasEdit={true}
        />
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

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksEditForm);
