import { FormGroup, ControlLabel, FormControl, HelpBlock, InputGroup } from 'react-bootstrap';
import { UiHeader, UiInput } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import ValidURL from 'valid-url';

class FieldGroup extends React.Component {
  render () {
    return (
      <FormGroup controlId={this.props.id}>
        <ControlLabel>{this.props.label}</ControlLabel>
        {this.props.addon && <InputGroup>
          <InputGroup.Addon>{this.props.addon}</InputGroup.Addon>
          <FormControl {...this.props} />
        </InputGroup>}
        {!this.props.addon && <FormControl {...this.props} />}
        {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
      </FormGroup>
    );
  }
}

var GoLinksForm = React.createClass ({
  render () {
    return (
      <div className="row">
        <FieldGroup
          id="alias"
          label="Go/ alias"
          help="Aliases must be lowercase, with no space, and unique."
          type="text"
          addon="go/"
          value={this.props.goLinks.newGoLinkData.alias}
          valid={this.props.goLinks.newGoLinkData.alias != ""}
          placeholder="e.g. shared_document"
          onChange={ (e) => { this.props.goLinksActions.setAlias(e.target.value); } }
        />
        <FieldGroup
          id="URL"
          label="URL"
          help="What is your alias redirecting to?"
          type="text"
          value={this.props.goLinks.newGoLinkData.url}
          valid={!this.props.goLinks.newGoLinkData.url || ValidURL.isWebUri(this.props.goLinks.newGoLinkData.url)}
          placeholder="http://..."
          onChange={ (e) => { this.props.goLinksActions.setUrl(e.target.value); } }
        />
        <FieldGroup
          id="description"
          label="Description"
          help="Enter a small description of your link (optional)"
          type="text"
          value={this.props.goLinks.newGoLinkData.description}
          valid={true}
          placeholder=""
          onChange={ (e) => { this.props.goLinksActions.setDescription(e.target.value); } }
        />
      </div>
    )
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
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksForm);
