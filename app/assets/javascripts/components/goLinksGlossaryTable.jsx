import { UiTable, UiInput, UiIcon, UiHeader, UiFilterGroup } from 'liveramp-ui-toolkit';
import AlertActions from 'actions/alertActions';
import GoLinksActions from 'actions/goLinksActions';
import GoLinksConstants from 'constants/goLinksConstants';
import AlertsConstants from 'constants/alertsConstants';
import GoLinksEditDelete from 'components/goLinksEditDelete';

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

const childComponent = (goLink) => {
  return (
    <div style={{paddingLeft: '15px'}}>
      <h3>{goLink.description}</h3>
    </div>
  );
};

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
      totalElements: this.props.goLinks.goLinksList.size,
      columnsToShow: columnsToShow,
      expanded: [],
      columnSortedBy: "alias",
      sortOrderAscending: true
    });
  },

  componentWillReceiveProps(newProps) {
    let filteredList = newProps.goLinks.filteredGoLinksList;
    this.setState({
      elements: filteredList
    });
  },

  render () {
    const { queryParams } = this.props.goLinks;
    const selectedOwner = queryParams.owner;
    const ownerOptions = GoLinksConstants.FILTER_OWNER_OPTIONS;

    const filters = [
      {
        name: GoLinksConstants.FILTER_OWNER,
        selectOptions: ownerOptions,
        selected: selectedOwner,
        isMulti: false,
      }
    ]

    const filterGroup = (
      <UiFilterGroup
        filterParams={filters}
        handleChange={this.handleFilterChange}
        hideClearAll={true}
      />
    );

    return (
      <div>
        <UiTable
          title={"Go/ Links Glossary"}
          initialFetchComplete={true}
          selectedRows={this.state.selectedRows}
          haveChildren={true}
          expandedRows={this.state.expanded}
          childComponent={childComponent}
          headerFilterGroup={filterGroup}
          headerButtonGroup={this.createButton()}
          elements={_.values(this.state.elements)}
          loadMoreElements={function(){}}
          hasMoreElements={false}
          handleSelectAllChange={this.handleSelectAllChange}
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

  handleCheckboxChange(id, checked) {
    console.log("id: " + id + ", checked: " + checked);
    var selectedRows;
    if (checked) {
      selectedRows = this.state.selectedRows;
      selectedRows.push(id);
    } else {
      selectedRows = this.state.selectedRows;
      var idx = _.indexOf(selectedRows, id);
      if (idx > -1) {
        selectedRows.splice(idx, 1);
      }
    }
    if (selectedRows.length === this.state.totalElements) {
      this.setState({
        selectedRows: selectedRows,
        selectAllChecked: true
      });
    } else {
      this.setState({
        selectedRows: selectedRows,
        selectAllChecked: false
      });
    }
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

  toggleChildren(id) {
    var expanded = this.state.expanded;
    if (!(_.contains(this.state.expanded, id))) {
      expanded.push(id);
    } else {
      var idx = _.indexOf(expanded, id);
      expanded.splice(idx, 1);
    }
    this.setState({
      expanded: expanded
    });
  },

  handleSelectAllChange(id, checked) {
    if (checked) {
      this.setState({
        selectAllChecked: true,
        selectedRows: _.map(this.state.elements, (el) => {return el.id;})
      });
    } else {
      this.setState({
        selectAllChecked: false,
        selectedRows: []
      });
    }
  },

  detailView (element) {
    console.log("detail view");
    console.log(element);
    console.log("-----");
    return (
      <div style={{position: 'relative', top: '-30px', height: '100%', backgroundColor: '#d8d8d8'}}>
        <UiHeader textTitle={element.alias} />
      </div>
    );
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
  handleDeleteClick(){
    console.log("Delete clicked ref");
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
