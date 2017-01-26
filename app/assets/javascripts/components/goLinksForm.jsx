import { FormGroup, ControlLabel, FormControl, HelpBlock, InputGroup, Button, ButtonGroup } from 'react-bootstrap';
import { UiHeader, UiInput } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import ValidURL from 'valid-url';

class FieldGroup extends React.Component {
  render () {
    return (
      <FormGroup
        controlId={this.props.id}
        validationState={this.props.validationState}
        bsSize="lg"
      >
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
  validateAlias(alias) {
    if (alias.length > 0) {
      var re = /[a-z0-9_-]*/i;
      var m = alias.match(re)[0];
      return (m.length == alias.length) ? null : "error";
    } else {
      return "error";
    }
  },

  validateUrl(url) {
    return ValidURL.isWebUri(url) ? null : "error" ;
  },

  disableState() {
    var aliasValid = !this.validateAlias(this.props.goLinks.newGoLinkData.alias);
    var urlValid = !this.validateUrl(this.props.goLinks.newGoLinkData.url);
    return !aliasValid || !urlValid ;
  },

  render () {
    return (
      <div className="row">
        <FieldGroup
          id="alias"
          label="Alias"
          help="Aliases must be lowercase, with no space, and unique."
          type="text"
          addon="go/"
          value={this.props.goLinks.newGoLinkData.alias}
          validationState={this.validateAlias(this.props.goLinks.newGoLinkData.alias)}
          placeholder="e.g. shared_document"
          onChange={ (e) => { this.props.goLinksActions.setAlias(e.target.value); } }
        />
        <FieldGroup
          id="URL"
          label="URL"
          help="What is your alias redirecting to?"
          type="text"
          value={this.props.goLinks.newGoLinkData.url}
          validationState={this.validateUrl(this.props.goLinks.newGoLinkData.url)}
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
        <ButtonGroup bsSize="large">
          <Button onClick={() => this.props.goLinksActions.redirect("/")} >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {this.props.submitButtonAction}}
            disabled={this.disableState()}
          >
            {this.props.submitButtonText}
          </Button>
        </ButtonGroup>
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
