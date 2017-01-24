import { UiHeader, UiInput, UiIcon } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';
import AlertActions from 'actions/alertActions';
import ValidURL from 'valid-url';

var GoLinksCreateForm = React.createClass ({

  render () {
    return (
      <div className="container">
      <div className="row">
        <UiHeader
          textTitle="Go Links"
          helpText="Create a Go/ link through this page"
        />
        <UiInput
          inputValue={this.props.goLinks.alias}
          label={"Alias"}
          placeholder={""}
          valid={!this.props.goLinks.alias}
          handleChange={ (e) => { this.props.goLinksActions.setAlias(e.target.value); } }
          labelShift={false}
        />
        <UiInput
          inputValue={this.props.goLinks.url}
          label={"URL"}
          placeholder={""}
          valid={!this.props.goLinks.url || ValidURL.isUri(this.props.goLinks.url)}
          handleChange={ (e) => { this.props.goLinksActions.setUrl(e.target.value); } }
          labelShift={false}
        />
        <UiInput
          inputValue={this.props.goLinks.description}
          label={"Description"}
          placeholder={""}
          valid={!this.props.goLinks.description}
          handleChange={ (e) => { this.props.goLinksActions.setDescription(e.target.value); } }
          labelShift={false}
        />
      </div>
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
    goLinksActions: Redux.bindActionCreators(GoLinksActions, dispatch),
    alertActions: Redux.bindActionCreators(AlertActions, dispatch),
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksCreateForm);
