import { UiIcon } from 'liveramp-ui-toolkit';

var SortableColumnHeader = React.createClass({

  render () {
    return (
      <div className='sortable-column-header'>
        <p>{this.props.label}</p>
        <div className='caret-icon'>
          <UiIcon
            icon={"caret-" + (this.props.direction || "up")}
            dimensions={this.props.dimensions}
            color={this.props.direction ? 'alert-green' : 'header-gray'}
            onClick={this.props.onClick}
            />
        </div>
      </div>
    );
  },

});

export default SortableColumnHeader;
