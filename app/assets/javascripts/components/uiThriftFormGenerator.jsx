import { UiInput } from 'liveramp-ui-toolkit';

const docs = {
  title: "UiThriftFormGenerator",
  propDetails: [
    {
      title: 'structFields',
      required: true,
      type: 'object',
      description: 'The returned object from calling struct_fields on the Thrift model'
    },
    {
      title: 'handleChange',
      required: true,
      type: 'function',
      description: 'The function that will be called whenever any of the generated input fields change state.'
    },
    {
      title: 'state',
      required: false,
      type: 'object',
      description: 'The current state of the form.'
    },
    {
      title: 'updateValidStatus',
      required: true,
      type: 'function',
      description: 'This funtion will be called with the current validity of the form when the form receives new props.'
    },
    {
      title: 'readOnly',
      required: false,
      type: 'boolean',
      description: 'If this is true, the model and its info will be displayed, but not be editable.'
    },
    {
      title: 'size',
      required: false,
      type: 'integer',
      description: 'The size (in characters) of the inputs.'
    },
  ]
}

const UiThriftFormGenerator = React.createClass({
  statics: {
    // The Thrift types below are defined in the Thrift standard, and unlikely to ever change.
    // https://godoc.org/github.com/samuel/go-thrift/thrift
    THRIFT_TYPES: {
      boolean: 2, //boolean
      double: 4, //number
      int16: 6, //number
      int32: 8, //number
      int64: 10, //number
      string: 11, //string
      map: 13, //hash
      set: 14, //hash
      list: 15, //array
    }
  },

  getDefaultProps() {
    return { readOnly: false };
  },

  getInitialState() {
    return { valid: true };
  },

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      let valid = true;
      _.each(nextProps.structFields, (inputDescriptor, key) => {
        if (!this.checkValid(inputDescriptor, nextProps.currentState, key)) {
          valid = false;
        }
      });
      if (!valid) {
        this.props.updateValidStatus(false);
      } else {
        this.props.updateValidStatus(true)
      }
    }
  },

  render() {
    let inputs = this.reduceStructToInputs(this.props.structFields, this.props.currentState, this.props.readOnly);
    return (
      <div className='lr-ui-thrift-form-generator'>
        {inputs}
      </div>
    );
  },

  reduceStructToInputs(structFields, thriftState) {
    return _.reduce(structFields, (accumulator, inputDescriptor, key) => {
      let valid = this.checkValid(inputDescriptor, thriftState, key);
      accumulator.push(
        <UiInput
          label={<h3>{inputDescriptor.name + ":"}</h3>}
          key={key}
          inputValue={thriftState[key]}
          placeholder={this.props.placeholder || "Enter " + inputDescriptor.name.toLowerCase() + " here"}
          valid={valid}
          formtext={true}
          handleChange={(e) => {
            this.props.handleChange(update(thriftState, {[key]: { $set: e.target.value}}));
          }}
          size={this.props.size}
          disabled={this.props.readOnly}
          />
      );
      return accumulator;
    }, []);
  },

  checkValid(inputDescriptor, thriftState, key) {
    let valid;
    switch (inputDescriptor.type) {
      case UiThriftFormGenerator.THRIFT_TYPES.string: // String
        valid = inputDescriptor.optional || typeof(thriftState[key]) === "string" && thriftState[key].length;
        break;
      case UiThriftFormGenerator.THRIFT_TYPES.double:
        valid = inputDescriptor.optional || /^[0-9]+\.?[0-9]*$/.test(thriftState[key]); //Enforces a valid double
        break;
      case UiThriftFormGenerator.THRIFT_TYPES.int16: //3 types that correspond to an integer
      case UiThriftFormGenerator.THRIFT_TYPES.int32:
      case UiThriftFormGenerator.THRIFT_TYPES.int64:
        valid = inputDescriptor.optional || /^[0-9]+$/.test(thriftState[key]); //Enforces a valid integer
        break;
      default:
        console.warn(`Unsupported field type ${inputDescriptor.type}. Please ensure that this is a valid Thrift type.`);
    }
    return valid;
  },
});

export default UiThriftFormGenerator;

export { docs };
