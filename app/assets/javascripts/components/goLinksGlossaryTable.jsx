import { UiTable, UiInput, UiIcon, UiHeader, UiFilterGroup } from 'liveramp-ui-toolkit';
import AlertActions from 'actions/alertActions';
import GoLinksActions from 'actions/goLinksActions';
import GoLinksConstants from 'constants/goLinksConstants';
import AlertsConstants from 'constants/alertsConstants';
import GoLinksEditDelete from 'components/goLinksEditDelete';
import GoLinksFilterGroup from 'components/goLinksFilterGroup';
import logo from '../../images/logos/GoLinksLogo.png';

const getKeyMap = props => (
  {
    alias: {
      columnName: 'Alias',
      sortable: true,
      width: 5,
      display: (alias) => {
        return (
          <span>{alias}</span>
        );
      }
    },
    url: {
      columnName: 'URL',
      sortable: false,
      width: 7,
      display: (url) => {
        return (
          <span><a href={url}> {url} </a> </span>
        );
      }
    },
    description: {
      columnName: 'Description',
      sortable: false,
      width: 7,
    },
    actions: {
      columnName: 'Edit/Delete',
      sortable: false,
      justification: 'center',
      width: 5,
      display: (value, element) => {
        return (
          <GoLinksEditDelete goLink={element} />
        );
      }
    }
  }
);

const columnOrder = ['alias', 'url', 'description', 'actions'];
const columnsToShow = ['alias', 'url', 'description', 'actions'];

const GoLinksGlossaryTable = React.createClass({
  getInitialState() {
    return ({
      showTable: true,
      tableSearchValue: this.props.goLinks.queryParams.search_query,
      selectedRows: [],
      elements: this.props.goLinks.filteredGoLinksList,
      selectAllChecked: false,
      totalElements: Object.keys(this.props.goLinks.goLinksList).length,
      columnsToShow: columnsToShow,
      expanded: [],
      columnSortedBy: "alias",
      sortOrderAscending: true
    });
  },

  componentWillReceiveProps(newProps) {
    let filteredList = newProps.goLinks.filteredGoLinksList;
    let fullListLength = Object.keys(newProps.goLinks.goLinksList).length;

    this.setState({
      elements: filteredList,
      totalElements: fullListLength
    });
  },

  render () {
    const { queryParams } = this.props.goLinks;
    const selectedOwner = queryParams.owner;
    const ownerOptions = GoLinksConstants.FILTER_OWNER_OPTIONS;
    const filterGroup = (
      <GoLinksFilterGroup
        selectedOwner={selectedOwner}
        ownerOptions={ownerOptions}
        handleChange={this.handleFilterChange}
      />
    );

    return (
      <div>
        <UiTable
          title={this.getGoLinksLogo()}
          initialFetchComplete={true}
          selectedRows={this.state.selectedRows}
          haveChildren={false}
          expandedRows={this.state.expanded}
          headerFilterGroup={filterGroup}
          headerButtonGroup={this.createButton()}
          elements={_.values(this.state.elements)}
          loadMoreElements={function(){}}
          hasMoreElements={false}
          elementKeyMap={getKeyMap(this.props)}
          handleShowHideColumn={this.handleShowHideColumn}
          elementName={"stellar Go/ link"}
          hideDetail={true}
          showCheckboxes={false}
          columnOrder={columnOrder}
          columnSortedBy={this.state.columnSortedBy}
          sortOrderAscending={this.state.sortOrderAscending}
          handleColumnSort={this.handleColumnSort}
          toggleChildren={this.toggleChildren}
          totalRows={this.state.totalElements}
          columnsToShow={this.state.columnsToShow}
          searchValue={this.state.tableSearchValue}
          handleSearchChange={this.handleSearchChange}
          handleSearchEnter={this.handleSearchEnter}
          loadingRowsCount={3}
          />
      </div>
    );
  },

  getGoLinksLogo() {
    return(
      <img
        className='go-links-logo'
        src={logo}
      />
    );
  },

  handleFilterChange(isMulti, name, selected) {
    let newParams = {};
    let newSelected;

    if (isMulti) {
      newSelected = selected ? selected.split(',') : [];
    } else {
      newSelected = selected ? selected : null;
    }

    switch(name) {
      case GoLinksConstants.FILTER_OWNER:
        newParams.owner = newSelected;
        break;
      default:
        // nothing
    }

    this.props.goLinksActions.updateQueryParams(newParams);
    this.props.goLinksActions.filterGoLinksList();
  },

  handleSearchChange(e) {
    this.setState({
      tableSearchValue: e.target.value
    });
  },

  handleSearchEnter(e) {
    var searchValue = e.target.value;
    this.props.goLinksActions.updateQueryParams({ search_query: searchValue });
    this.props.goLinksActions.filterGoLinksList();
  },

  handleColumnSort (column, ordering) {
    var newElements = _.sortBy(_.values(this.state.elements), function(element) { return element[column]; });
    if (!ordering) {
      newElements = newElements.reverse();
    }
    this.setState({
      elements: newElements,
      columnSortedBy: column,
      sortOrderAscending: ordering
    })
  },

  handleShowHideColumn(columnName, show) {
    if (show) {
      if (!_.contains(columnsToShow, columnName)) {
        var newColumns = this.state.columnsToShow;
        newColumns.push(columnName);
      }
    } else {
      if(_.contains(columnsToShow, columnName)) {
        var newColumns = this.state.columnsToShow;
        var idx = _.indexOf(newColumns, columnName);
        newColumns.splice(idx, 1);
      }
    }
    this.setState({
      columnsToShow: newColumns
    });
  },

  createButton() {
    return (
      <button onClick={() => { this.props.goLinksActions.populateAliasInfo(window.location.pathname)
                               this.props.goLinksActions.redirect("/create")} } className="button">
        + Create Go/ Link
      </button>
    );
  },
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

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(GoLinksGlossaryTable);
