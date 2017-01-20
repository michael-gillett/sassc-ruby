import { UiTitle, UiSelect } from 'liveramp-ui-toolkit';
import UiThriftFormGenerator from 'components/uiThriftFormGenerator';

var EndpointConfig = React.createClass ({

  render () {
    return (
      <div className="titled-form-section">
        <UiTitle
          textTitle="Configuration"
          />
        { this.getConfigSelect() }
        <UiThriftFormGenerator
          structFields={this.props.structFields}
          currentState={this.props.protocolAttributes}
          handleChange={this.props.updateThriftData}
          updateValidStatus={this.props.updateValidStatus}
          readOnly={!this.props.editMode}
          />
      </div>
    );
  },

  getConfigSelect() {
    if (this.props.editMode) {
      return (
        <div className="form-input-container">
          <UiSelect
            placeholder="Select config type here"
            selectOptions={this.props.options}
            selected={this.props.protocol}
            handleChange={this.props.fetchSelectedStruct}
            clearable={false}
            fixedWidth={true}
            />
        </div>
      );
    } else {
      return (
        <div>
          Config Type: { _.find(this.props.options, (option) => (option.value === this.props.protocol)).label }
        </div>
      );
    }
  },

});

export default EndpointConfig;
