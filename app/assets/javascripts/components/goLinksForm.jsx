import { UiHeader, UiInput } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import ValidURL from 'valid-url';

var GoLinksForm = React.createClass ({
  render () {
    return (
    <div className="row">
      <UiHeader
        textTitle="Go Links"
        helpText="Create a Go/ link through this page"
      />
      <UiInput
        inputValue={this.props.goLinks.newGoLinkData.alias}
        label={"Alias"}
        placeholder={""}
        valid={this.props.goLinks.newGoLinkData.alias}
        handleChange={ (e) => { this.props.goLinksActions.setAlias(e.target.value); } }
        labelShift={false}
      />
      <UiInput
        inputValue={this.props.goLinks.newGoLinkData.url}
        label={"URL"}
        placeholder={""}
        valid={!this.props.goLinks.newGoLinkData.url || ValidURL.isWebUri(this.props.goLinks.newGoLinkData.url)}
        handleChange={ (e) => { this.props.goLinksActions.setUrl(e.target.value); } }
        labelShift={false}
      />
      <UiInput
        id="description"
        inputValue={this.props.goLinks.newGoLinkData.description}
        label={"Description"}
        placeholder={""}
        valid={true}
        handleChange={ (e) => { this.props.goLinksActions.setDescription(e.target.value); } }
        labelShift={false}
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
