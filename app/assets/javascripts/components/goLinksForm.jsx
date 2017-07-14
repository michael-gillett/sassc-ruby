import { FormGroup, ControlLabel, FormControl, HelpBlock, InputGroup, Button, ButtonGroup, Alert } from 'react-bootstrap';
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
    const { newGoLinkData, goLinksList } = this.props.goLinks;
    const linkAlias = goLinks.newGoLinkData.alias;
    const originalLink = _.find(goLinks.goLinksList, function(link){ return link.alias == linkAlias });

    const ParamAlert = React.createClass({
      getInitialState() {
        return {
          alertVisible: false
        };
      },

      render() {
        if (this.state.alertVisible) {
          return (
            <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
              Just include "&lt;param&gt;" in the URL one or more times! For example:
              <ul>
                <li>Alias: "go/adminhelper"</li>
                <li>URL: "http://&lt;param&gt;.admin.liveramp.net/&lt;param&gt;"</li>
                <li>Used as: "go/adminhelper/audience/111419" or "go/adminhelper/company/488408"</li>
              </ul>

            </Alert>
          );
        }

        return (
          <Button onClick={this.handleAlertShow}>See How</Button>
        );
      },

      handleAlertDismiss() {
        this.setState({alertVisible: false});
      },

      handleAlertShow() {
        this.setState({alertVisible: true});
      }
    });

    return (
      <div className="row">
        <FieldGroup
          id="alias"
          label="Alias"
          help="Aliases must be lowercase, without spaces, and unique."
          type="text"
          addon="go/"
          value={newGoLinkData.alias}
          validationState={this.validateAlias(newGoLinkData.alias, disableAliasEdit)}
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
        <HelpBlock id="url_tip" bsSize="lg">
            <ControlLabel>Did you know? You can now add parameters to Go Links.</ControlLabel>
            <br />
            <ParamAlert id="test"/>
        </HelpBlock>
        <br />
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
            disabled={this.disableState(originalLink, newGoLinkData, disableAliasEdit)}
          >
            {submitButtonText}
          </Button>
        </ButtonGroup>
      </div>
    )
  },

  validateUniqueAlias(alias, disableAliasEdit) {
    var indexOfAlias = this.props.goLinks.goLinksList.map(function(link){return link.alias;}).indexOf(alias);
    // return value > 0 means the link was found in the list, i.e. not unique
    return !( indexOfAlias > 0) || disableAliasEdit;
  },

  validateAlias(alias, disableAliasEdit) {
    if (alias.length > 0) {
      var re = /[a-z0-9_-]*/i;
      var m = alias.match(re)[0];
      var uniqueAlias = this.validateUniqueAlias(alias, disableAliasEdit);
      return ((m.length == alias.length) && uniqueAlias) ? null : "error";
    } else {
      return "error";
    }
  },

  validateUrl(url) {
    return ValidURL.isWebUri(this.removeAll(GoLinksConstants.PARAM_FLAG, url)) ? null : "error" ;
  },

  removeAll(find, str) {
    return str.replace(new RegExp(find, 'g'), "")
  },

  disableState(originalLink, newGoLinkData, disableAliasEdit) {
    var aliasValid = !this.validateAlias(newGoLinkData.alias, disableAliasEdit);
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
