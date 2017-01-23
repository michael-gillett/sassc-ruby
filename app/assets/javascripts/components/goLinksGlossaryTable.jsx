import { UiTable, UiInput, UiIcon, UiHeader } from 'liveramp-ui-toolkit'

const keyMap = {
  id: {
    columnName: 'Employee ID',
    sortable: true,
    width: 1,
    display: (id) => {
      return (
        <span>ID: {id}</span>
      );
    }
  },
  name: {
    columnName: 'Name',
    sortable: true,
    width: 1,
    justification: 'center',
    display: (name, element) => {
      return (
        <span>{`${name} - ${element['id']}`}</span>
      );
    },
    tooltipDisplay: (name) => {
      return `Arbor and Circulate: ${name}`
    }
  },
  gender: {
    columnName: 'Gender Gender Gender Gender Gender Gender',
    sortable: true,
    width: 1,
    tooltipDisplay: (name, element) => {
      return element.id
    }
  },
  company: {
    columnName: <UiIcon icon='desktop' dimensions={[20, 20]} color='select-green' />,
    columnHeaderTooltip: () => {
      return 'Web Reach'
    },
    sortable: true,
    justification: 'center',
    width: 1,
    display: (company) => {
      return (
        <span>{company}</span>
      );
    }
  },
  email: {
    columnName: 'Email EmailEmailEmailEmailEmailEmailEmailEmail',
    sortable: false,
    width: 1,
    display: (email) => {
      return (
        <span>{email}</span>
      );
    }
  }
}

const childComponent = (person) => {
  return (
    <div style={{paddingLeft: '30px'}}>
      <h1>{person.name}</h1>
    </div>
  );
}

const people = [
  {
    "id": 2995,
    "age": 39,
    "name": "Payne Luna",
    "gender": "male",
    "company": "SKINSERVE",
    "email": "payneluna@skinserve.com",
    "phone": "+1 (893) 570-2872"
  },
  {
    "id": 2996,
    "age": 36,
    "name": "Small Blair",
    "gender": "male",
    "company": "MEDIOT",
    "email": "smallblair@mediot.com",
    "phone": "+1 (904) 424-3388"
  },
  {
    "id": 2997,
    "age": 23,
    "name": "Shanna Mosley",
    "gender": "female",
    "company": "CUBIX",
    "email": "shannamosley@cubix.com",
    "phone": "+1 (853) 490-3052"
  },
  {
    "id": 2998,
    "age": 23,
    "name": "Sullivan Padilla",
    "gender": "male",
    "company": "CHILLIUM",
    "email": "sullivanpadilla@chillium.com",
    "phone": "+1 (919) 580-2352"
  },
  {
    "id": 2999,
    "age": 26,
    "name": "Alice James",
    "gender": "female",
    "company": "RECRISYS",
    "email": "alicejames@recrisys.com",
    "phone": "+1 (935) 418-3230"
  }
];

const columnOrder = ['id', 'name', 'gender', 'company', 'email'];
const columnsToShow = ['id', 'name', 'gender', 'company', 'email'];

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
      shownElements: people.slice(0, 50),
      elements: people,
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
          <div className="button" onClick={this.toggleTable}>Hide</div>
          <UiTable
            title={"LiveRamp Employees"}
            initialFetchComplete={true}
            selectedRows={this.state.selectedRows}
            handleCheckboxChange={this.handleCheckboxChange}
            haveChildren={true}
            expandedRows={this.state.expanded}
            childComponent={childComponent}
            headerFilterGroup={<div>FILTER GROUP </div>}
            headerButtonGroup={<div>BUTTON GROUP </div>}
            elements={this.state.shownElements}
            loadMoreElements={this.loadMoreElements}
            hasMoreElements={this.state.shownElements.length < 3000}
            selectAllChecked={this.state.selectAllChecked}
            handleSelectAllChange={this.handleSelectAllChange}
            elementKeyMap={keyMap}
            handleShowHideColumn={this.handleShowHideColumn}
            elementName={"stellar employee"}
            detailView={this.detailView}
            showCheckboxes={true}
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

  toggleChildren(id) {
    console.log(id);
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
        <h2>{element.email}</h2>
        <h2>{element.company}</h2>
        <h2>{element.gender}</h2>
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

export default GoLinksGlossaryTable;
