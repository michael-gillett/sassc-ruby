import { UiTable, UiInput, UiIcon, UiHeader } from 'liveramp-ui-toolkit';
import AlertActions from 'actions/alertActions';
import GoLinksActions from 'actions/goLinksActions';

const keyMap = {
  alias: {
    columnName: 'Alias',
    sortable: true,
    width: 1,
    display: (alias) => {
      return (
        <span>{alias}</span>
      );
    }
  },
  url: {
    columnName: 'URL',
    sortable: true,
    width: 1.5,
    display: (url) => {
      return (
        <span><a href={url}> {url} </a> </span>
      );
    }
  },
  description: {
    columnName: 'Description',
    sortable: true,
    width: 1,
    tooltipDisplay: (name, element) => {
      return element.id
    }
  },
  actions: {
    columnName: " Edit/Delete",
    sortable: false,
    justification: 'center',
    width: 0.5,
    display: () => {
      return (
        <UiIcon icon='edit' dimensions={[20, 20]} color='select-green' />
        // <UiIcon icon='trash' dimensions={[20, 20]} color='select-green' />
      );
    }
  }
}

const childComponent = (goLink) => {
  return (
    <div style={{paddingLeft: '30px'}}>
      <span>{goLink.description}</span>
    </div>
  );
}

const goLinks = [
  {
    "id": "kb",
    "alias": "kb",
    "url": "https://support.liveramp.com",
    "description": "The base of all knowledge.",
    "owner": "Each and every one of us."
  },
  {
    "id": "turntbot",
    "alias": "turntbot",
    "url": "https://turntbot.com",
    "description": "Let's get turnt.",
    "owner": "Andy"
  },
  {
    "id":"gdocs",
    "alias": "gdocs",
    "url": "https://docs.google.com",
    "description": "Because go/gdocs is shorter that docs.google.com",
    "owner": "Sergey Brin & Larry Page"
  }, 
  {
    "id": "sfofficemap",
    "alias": "sfofficemap",
    "url": "https://support.liveramp.com/pages/viewpage.action?pageId=1769611",
    "description": "SF Office map",
    "owner": "Sherif"
  },
  {
    "id": "okta",
    "alias": "okta",
    "url": "https://acxiom.okta.com/",
    "description": "Login portal",
    "owner": "Sherif"
  }
];

const columnOrder = ['alias', 'url', 'description', 'actions'];
const columnsToShow = ['alias', 'url', 'description', 'actions'];

const sidebarOptions = {
  sections: [
    { label: 'information', smallIcon: true },
    { label: 'price'},
    { label: 'restricted-use' },
    { label: 'whitelist' },
    { label: 'blacklist' },
    { label: 'statistics', tall: true, tooltipText: 'Segment Statistics' }
  ]
};

const GoLinksGlossaryTable = React.createClass({
  getInitialState() {
    return ({
      showTable: true,
      tableSearchValue: "",
      selectedRows: [],
      shownElements: goLinks.slice(0, 2),
      elements: goLinks,
      selectAllChecked: false,
      totalElements: 3000,
      columnsToShow: columnsToShow,
      expanded: [],
      columnSortedBy: "id",
      sortOrderAscending: true
    });
  },

  //change initialFetchComplete to false to see loading rows
  render () {
    if(this.state.showTable) {   
      return (
        <div>
          <button onClick={() => this.props.goLinksActions.redirect("/create")} className="button">
            + Create Link
          </button>

          <div className="button" onClick={this.toggleTable}>Hide</div>
          <UiTable
            title={"LiveRamp Employees"}
            initialFetchComplete={true}
            selectedRows={this.state.selectedRows}
            handleCheckboxChange={this.handleCheckboxChange}
            haveChildren={true}
            expandedRows={this.state.expanded}
            childComponent={childComponent}
            headerFilterGroup={<div></div>}
            headerButtonGroup={<div></div>}
            elements={this.state.shownElements}
            loadMoreElements={this.loadMoreElements}
            hasMoreElements={this.state.shownElements.length < 5}
            selectAllChecked={this.state.selectAllChecked}
            handleSelectAllChange={this.handleSelectAllChange}
            elementKeyMap={keyMap}
            handleShowHideColumn={this.handleShowHideColumn}
            elementName={"stellar employee"}
            detailView={this.detailView}
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
            sidebarOptions={sidebarOptions}
            />
        </div>
      );
    } else {
      return (
        <div className="button" onClick={this.toggleTable}>Show</div>
      );
    }
  },

  toggleTable() {
    this.setState({
      showTable: !this.state.showTable
    })
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

  handleSearchChange(e) {
    this.setState({
      tableSearchValue: e.target.value
    });
  },

  handleSearchEnter(e) {
    console.log(this.state.tableSearchValue);
  },

  toggleChildren(alias) {
    console.log(alias);
    var expanded = this.state.expanded;
    if (!(_.contains(this.state.expanded, alias))) {
      expanded.push(alias);
    } else {
      var idx = _.indexOf(expanded, alias);
      expanded.splice(idx, 1);
    }
    this.setState({
      expanded: expanded
    });
  },

  loadMoreElements(i) {
    this.setState({
      shownElements: this.state.elements.slice(0, 50*(i + 1))
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
        <UiHeader textTitle={element.name} />
        <h2>{element.alias}</h2>
        <h2>{element.owner}</h2>
        <h2>{element.description}</h2>
      </div>
    );
  },

  handleColumnSort (column, ordering) {
    var newElements = _.sortBy(this.state.elements, function(element) { return element[column]; });
    if (!ordering) {
      newElements = newElements.reverse();
    }
    this.setState({
      elements: newElements,
      shownElements: newElements.slice(0, this.state.shownElements.length),
      columnSortedBy: column,
      sortOrderAscending: ordering
    })
  },

  handleShowHideColumn(columnName, show) {
    console.log("handling show hide column");
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
  }
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
