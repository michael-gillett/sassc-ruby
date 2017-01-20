import SortableColumnHeader from 'components/sortableColumnHeader';
import SortingConstants from 'constants/sortingConstants';

var TaxonomyEndpointListHeader = React.createClass({

  render () {
    return (
      <div className='endpoint-list-header'>
        <div className='col-xs-1'>
          <SortableColumnHeader
            label="ID"
            dimensions={[10, 10]}
            onClick={this.props.onClickId}
            direction={this.idCaretDirection()}
            />
        </div>
        <div className='col-xs-11'>
          <SortableColumnHeader
            label="Name"
            dimensions={[10, 10]}
            onClick={this.props.onClickName}
            direction={this.nameCaretDirection()}
            />
        </div>
      </div>
    );
  },

  nameCaretDirection() {
    switch (this.props.sortingMechanism) {
      case SortingConstants.SORT_BY_NAME_DESCENDING:
        return "down";

      case SortingConstants.SORT_BY_NAME_ASCENDING:
        return "up";

      default:
        return undefined;
    }
  },

  idCaretDirection() {
    switch (this.props.sortingMechanism) {
      case SortingConstants.SORT_BY_ID_DESCENDING:
        return "down";

      case SortingConstants.SORT_BY_ID_ASCENDING:
        return "up";

      default:
        return undefined;
    }
  },

});

export default TaxonomyEndpointListHeader;
