import { UiTitle, UiCollapse } from 'liveramp-ui-toolkit';
import FormTextField from 'components/formTextField';

var EndpointInfo = React.createClass ({

  render () {
    return (
      <div className="titled-form-section">
        <UiTitle
          textTitle="Basic Information"
          />
        { this.getNameSection() }
        { this.getFormatSection() }
        {
          this.props.editMode &&
          <div className="titled-form-section">
            <UiCollapse
              expanded={this.props.showMacros}
              expandPrompt={this.props.expandButton}
              collapsePrompt={this.props.collapseButton}
              info={this.props.macroTable}
              />
          </div>
        }
      </div>
    );
  },

  getNameSection() {
    if (this.props.editMode) {
      return (
        <FormTextField
          label="Name"
          inputValue={this.props.name}
          valid={this.props.nameValid !== false}
          handleChange={(event) => this.props.updateNameField(event.target.value)}
          />
      );
    } else {
      return (
        <div>
          Name: {this.props.name}
        </div>
      );
    }
  },

  getFormatSection() {
    if (this.props.editMode) {
      return (
        <FormTextField
          label="Segment Body Format"
          inputValue={this.props.format}
          valid={this.props.formatValid !== false}
          handleChange={(event) => this.props.updateFormatField(event.target.value)}
          size={60}
          />
      );
    } else {
      return (
        <div>
          Segment Body Format: {this.props.format}
        </div>
      );
    }
  },

});

export default EndpointInfo;
