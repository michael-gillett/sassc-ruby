import { UiIcon, UiDropdown } from 'liveramp-ui-toolkit';

var TaxonomyEndpointListRow = React.createClass({

  render () {
    return (
      <div className='endpoint-row'>
        <div className='col-xs-1 endpoint-id-field'>
          {this.props.id}
        </div>
        <div data-tip={this.props.name} className='col-xs-10 endpoint-name-field'>
          {this.props.name}
        </div>
        <div className='col-xs-1 endpoint-data-field'>
          <UiDropdown
            title={this.getDropdownIcon()}
            options={[{text: "View", handleChange: () => this.props.redirect(`/${this.props.id}`)}]}
            color='gray'
            hideCaret={true}
            />
        </div>
      </div>
    );
  },

  getDropdownIcon() {
    return <UiIcon
      icon={'caret-down'}
      dimensions={[18, 18]}
      color="header-gray"
      onClick={ () => {} }
      />;
  },

});

export default TaxonomyEndpointListRow;
