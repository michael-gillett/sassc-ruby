import { UiInput, UiIcon } from 'liveramp-ui-toolkit';

var RequiredTaxonomyPropertyListRow = React.createClass({

  render () {
    return (
      <div className='required-properties-row'>
        <div data-tip={this.props.name} className='col-xs-2 required-properties-field'>
          { this.getNameBox() }
        </div>
        <div data-tip={this.props.description} className='col-xs-8 required-properties-field'>
          { this.getDescriptionBox() }
        </div>
        { this.props.editMode &&
          <div className='col-xs-1 edit-form-buttons-container'>
            <UiIcon
              icon={'trash'}
              dimensions={[18, 18]}
              color="header-gray"
              onClick={this.props.onDelete}
              />
          </div>
        }
      </div>
    );
  },

  getNameBox() {
    if (this.props.editMode) {
      return <UiInput
        inputValue={this.props.name}
        placeholder="Name"
        valid={this.props.nameValid !== false}
        formtext={true}
        handleChange={this.props.onChangeName}
        />;
    } else {
      return this.props.name;
    }
  },

  getDescriptionBox() {
    if (this.props.editMode) {
      return <UiInput
        inputValue={this.props.description}
        placeholder="Description"
        valid={this.props.descriptionValid !== false}
        formtext={true}
        size={100}
        handleChange={this.props.onChangeDescription}
        />;
    } else {
      return this.props.description;
    }
  },

});

export default RequiredTaxonomyPropertyListRow;
