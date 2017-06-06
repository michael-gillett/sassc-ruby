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

  render () {

    const { goLinks, goLinksActions, disableAliasEdit, submitButtonAction, submitButtonText } = this.props;
    const { newGoLinkData } = this.props.goLinks;
    const linkAlias = goLinks.newGoLinkData.alias;
    const originalLink = goLinks.goLinksList[linkAlias];

    return (
      <div className="row">
        <FieldGroup
          id="alias"
          label="Alias"
          help="Aliases must be lowercase, with no space, and unique."
          type="text"
          addon="go/"
          value={newGoLinkData.alias}
          validationState={this.validateAlias(newGoLinkData.alias)}
          placeholder="e.g. shared_document"
          onChange={ (e) => { goLinksActions.setAlias(e.target.value); } }
          disabled={disableAliasEdit}
        />
        <FieldGroup
          id="URL"
          label="URL"
          help="What is your alias redirecting to?"
          type="text"
          value={newGoLinkData.url}
          validationState={this.validateUrl(newGoLinkData.url)}
          placeholder="http://..."
          onChange={ (e) => { goLinksActions.setUrl(e.target.value); } }
        />
        <FieldGroup
          id="description"
          label="Description"
          help="Enter a small description of your link (optional)"
          type="text"
          value={newGoLinkData.description}
          valid={true}
          placeholder=""
          onChange={ (e) => { goLinksActions.setDescription(e.target.value); } }
        />
        <ButtonGroup bsSize="large">
          <Button onClick={() => {  goLinksActions.clearEditInfo()
                                    goLinksActions.redirect("/") }}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={submitButtonAction}
            disabled={this.disableState(originalLink, newGoLinkData)}
          >
            {submitButtonText}
          </Button>
        </ButtonGroup>
      </div>
    )
  },

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

  disableState(originalLink, newGoLinkData) {
    var aliasValid = !this.validateAlias(newGoLinkData.alias);
    var urlValid = !this.validateUrl(newGoLinkData.url);
    var linkDataUnchanged = _.isMatch(originalLink, newGoLinkData);
    return !aliasValid || !urlValid || linkDataUnchanged;
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
