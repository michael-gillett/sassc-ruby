import { UiInput } from 'liveramp-ui-toolkit';

var FormTextField = React.createClass({

  render () {
    return (
      <div className="form-input-container">
        <UiInput
          label={<h3>{this.props.label + ":"}</h3>}
          key={this.props.key}
          inputValue={this.props.inputValue}
          placeholder={this.props.placeholder || "Enter " + this.props.label.toLowerCase() + " here"}
          valid={this.props.valid}
          formtext={true}
          handleChange={this.props.handleChange}
          size={this.props.size}
          />
      </div>
    );
  },

});

export default FormTextField;
