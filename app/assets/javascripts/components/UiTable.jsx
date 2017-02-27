import UiHeader from './uiHeader.jsx';
import UiSearch from './uiSearch.jsx';
import UiCheckbox from './uiCheckbox.jsx';
import UiIcon from './uiIcon.jsx';
import UiButtonGroup from './uiButtonGroup.jsx';
import UiDropdown from './uiDropdown.jsx';
import UiLoadingComponent from './uiLoadingComponent.jsx';
import UiTableSidebar from './uiTableSidebar.jsx';

import CSSTransitionGroup from 'react-addons-css-transition-group';
import InfiniteScroll from 'react-infinite-scroller';
import ReactTooltip from 'react-tooltip';

var leftBorder;

// User must pass in:
//  - initialFetchComplete        : boolean   : whether the initial fetch is complete
//  - title                       : string    : the title for the table
//  - columnSortedBy              : string    : the name of the key on which the table is sorted
//  - sortOrderAscending          : boolean   : whether the sort order on the column is ascending or not
//  - handleColumnSort            : function  : a function to handle column sorting that takes in the name of the column and a boolean that determines if the sort order is ascending or not
//  - hideDetail                  : boolean   : whether or not to hide the ability to show the detail view
//  - detailView                  : function  : a function that takes in an element and returns a detail view. Also passed a section name for navigation if a sidebar exists
//  - headerFilterGroup           : object    : A group of filters (UiFilterGroup) to be displayed in the header
//  - headerButtonGroup           : object    : A group of buttons (UiButtonGroup) to be displayed in the header
//  - searchValue                 : string    : the value of the string in the UiSearch component in the header
//  - handleSearchChange          : function  : A function that handles change in the UiSearch component that takes in the event
//  - handleSearchEnter           : function  : A function that handles the user pressing enter while focused on the UiSearch component
//  - handleCheckboxChange        : function  : A function that handles the user clicking a row checkbox, takes in the id of the element and a boolean representing whether or not the checkbox is checked
//  - handleSelectAllChange       : function  : A function that handles the user clicking the select all checkbox, the second argument is a boolean which tells whether or not the checkbox is checked
//  - selectAllChecked            : boolean   : whether or not the select all checkbox is checked
//  - selectedRows                : array     : array of element id's representing which elements are selected
//  - loadMoreElements            : function  : a function which gets called when the user scrolls to the bottom of the infinite scroll component
//  - hasMoreElements             : boolean   : whether or not there are more elements to load when scrolling to the bottom of the infinite scroll component
//  - haveChildren                : boolean   : whether or not the elements have children
//  - expandedRows                : array     : array of element id's representing which elements are expanded (child component is showing)
//  - childComponent              : function  : a function that takes in the element and returns the child component
//  - totalRows                   : integer   : total number of elements in the table, used for the header
//  - elements                    : array     : the array of elements to show in the table
//  - handleShowHideColumn        : function  : a function to show or hide a column - takes in the key that the column maps to and a boolean determining whether it should be shown or not
//  - handleColumnResize          : function  : a function that handles column resizing (TBD)
//  - toggleChildren              : function  : a function that updates the state of expandedRows in the parent element - takes in the id of the element
//  - elementName                 : string    : a name for the elements shown in the table - used in the header
//  - elementKeyMap               : object    : an object that maps the keys of the elements passed in to various properties in their rendering in the table
//     * Each property should map to:
//      + columnName: the name for the column - used in the column header
//      + sortable: boolean determining whether or not the column is sortable
//      + width: the relative width of the column
//        -- If the widths of all of the columns shown add up to less than or equal to 24, they will be scaled to fit the containing element's width and given widths proportional to their widths
//        -- If the widths add up to greater than 24, they will extend beyond the width of their containing element and will be sized according to their relative widths
//      + display: an optional function that determines how to display the information. If no function is passed, a span with the property's value is used
//        -- If optional function is provided, the first argument corresponds to the property's value for the given element
//        -- If optional function is provided, the optional second argument corresponds to the element with all its attributes
//      + tooltipDisplay: an optional function that determines the tooltip content if tooltipOnOverflow is 'true'. If no function is passed, the property's value is used
//        -- If optional function is provided, the first argument corresponds to the property's value for the given element
//        -- If optional function is provided, the optional second argument corresponds to the element with all its attributes
//      + columnHeaderTooltip: an optional function that determines the permanent tooltip texts.  Takes precendent over  'tooltipOnOverflow' and 'tooltipDisplay'

//  - columnOrder                 : array     : the order that the columns should be shown in - the elements of this array are the keys of the objects, not their columnNames
//  - columnsToShow               : array     : An array of columns that should be shown in the table - again, these map to keys of the elements, not the actual name of the column
//  - showCheckboxes              : boolean   : whether or not to show checkboxes
//  - hideSearch                  : boolean   : whether or not to show the search in the header
//  - hideFilters                 : boolean   : whether or not to show the filters
//  - hideScrollToTop             : boolean   : whether or not to show the scrollToTop button

// User may pass in:
//  - customFirstRow              : object    : JSX tag for the first row of the table (commonly used for select all by filters)
//  - showCustomFirstRow          : boolean   : whether or not to show the customFirstRow
//  - emptyView                   : object    : JSX tag for the empty view (displayed if initialFetchComplete is true and elements.length === 0)
//  - tooltipOnOverflow           : boolean   : whether or not to show a tooltip when hovered on row element or header that is overflowing (defaults to 'true')
//  - loadingRowsCount            : integer   : number of grey loading rows to show, defaults to 20, for testing set initialFetchComplete to false
//  - disableCheckOnRowClick      : boolean   : whether or not to disable the checkbox being clicked when you click on a row

const UiTable = React.createClass({
  getInitialState() {
    return ({
      columnSelectorOpen: false,
      detailViewOpen: false,
      detailViewElement: null,
      detailViewSection: null,
      lastHoveredElement: null,
      hideScrollToTop: true
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    ReactTooltip.rebuild();
  },

  componentWillUnmount: function() {
    if (this.scrollListener) {
      this.rowContainer.removeEventListener('scroll', this.handleScroll);
    }
  },

  render() {
    const { initialFetchComplete,
            title,
            columnSortedBy,
            sortOrderAscending,
            handleColumnSort,
            detailView,
            headerFilterGroup,
            headerButtonGroup,
            searchValue,
            handleSearchChange,
            handleSearchEnter,
            handleCheckboxChange,
            handleSelectAllChange,
            selectAllChecked,
            selectedRows,
            loadMoreElements,
            hasMoreElements,
            handleCheck,
            haveChildren,
            expandedRows,
            childComponent,
            totalRows,
            elements,
            handleShowHideColumn,
            handleColumnResize,
            toggleChildren,
            elementName,
            elementKeyMap,
            columnOrder,
            columnsToShow,
            showCheckboxes,
            hideSearch,
            hideFilters,
            emptyView,
            sidebarOptions } = this.props;

    var { hideScrollToTop } = this.props;

    if (elements.length <= 20 || this.state.hideScrollToTop) {
      hideScrollToTop = true;
    }

    var totalWidth = 0;

    _.each(columnsToShow, (column) => {
      totalWidth += elementKeyMap[column].width
    });

    var containerWidth;
    if (totalWidth <= 24) {
      containerWidth = "100%";
    } else {
      containerWidth = Math.round((totalWidth/24.0) * 100) + "%";
    }

    this.totalWidth = totalWidth;
    this.containerWidth = containerWidth;

    var selectedRowsHash = {};
    _.each(selectedRows, (row) => {
      selectedRowsHash[row] = true;
    })
    this.selectedRowsHash = selectedRowsHash;

    var expandedRowsHash = {};
    _.each(expandedRows, (id) => {
      expandedRowsHash[id] = true;
    })

    this.expandedRowsHash = expandedRowsHash;

    let sidebar = '';
    // Show the standard sidebar if options are passed, the detail view is not open, and we don't have zero elements.
    if (sidebarOptions && !this.state.detailViewOpen && !(initialFetchComplete && elements.length === 0)) {
      sidebar = (
        <div className="lr-ui-table-sidebar-indicator-container">
          <div className="lr-ui-table-sidebar-indicator-black-bar"></div>
          <div className="lr-ui-table-sidebar-indicator-white-stripe"></div>
          <div className="lr-ui-table-sidebar-container">
            <UiTableSidebar
              sections={sidebarOptions.sections}
              activeSection={this.state.detailViewSection}
              navigateSection={(section) => this.openDetailViewFromSidebar(section)}
            />
          </div>
        </div>
      );
    }

    if (!initialFetchComplete) {
      return (
        <div className="lr-ui-table">
          { this.getHeader() }
          { !hideFilters ? this.getFilters() : null }
          <div className="lr-ui-table-container">
            { this.getColumnHeaders() }
            { this.getLoadingRows() }
          </div>
        </div>
      )
    }

    return (
      <div className="lr-ui-table">
        { this.getHeader() }
        { !hideFilters ? this.getFilters() : null }
        <div className="lr-ui-table-container">
          { this.getColumnHeaders() }
          {sidebar}
          { elements.length === 0 && emptyView ? emptyView : this.getRows() }
        </div>
        <CSSTransitionGroup
          transitionName='lr-ui-table-scroll'
          transitionAppear={true}
          transitionEnterTimeout={250}
          transitionAppearTimeout={250}
          transitionEnter={true}
          transitionLeave={true}
          transitionLeaveTimeout={0}
          >
          { !hideScrollToTop ? <div className="lr-ui-table-scroll-container" ><UiIcon dimensions={[20, 20]} icon={"caret-up"} color={"header-gray"} onClick={() => {$(".lr-ui-table-row-container").animate( { scrollTop: 0 } );}}/></div> : null }
        </CSSTransitionGroup>
        { this.getRowTooltip() }
        { this.getHeaderTooltip() }
      </div>
    );
  },

  getRowTooltip () {
    const { tooltipOnOverflow=true } = this.props;

    if (tooltipOnOverflow) {
      const tooltip = <ReactTooltip id='uiTableRowTooltip' place="bottom" type="dark" effect='solid' getContent={() => {
        // Overflowing when scrollWidth is greater than the offsetWidth
        const elem = document.getElementById(event.target.id);
        return (elem && elem.offsetWidth < elem.scrollWidth) ? elem.getAttribute('data-tip') : null;
      }} />

      return tooltip
    } else {
      return null;
    }
  },

  getHeaderTooltip () {
    const { tooltipOnOverflow=true } = this.props;

    return <ReactTooltip id='uiTableHeaderTooltip' place="top" type="dark" effect='solid' getContent={() => {
      const elem = document.getElementById(event.target.id);
      // If element has a permanent tooltip or has 'tooltipOnOverflow' set and it is overflowing
      if (elem && elem.hasAttribute('data-permanent') || (tooltipOnOverflow && elem.offsetWidth < elem.scrollWidth)) {
        return elem.getAttribute('data-tip');
      } else {
        // React tooltip will display 'data-tip content when getContent returns 'null', so make data-tip null
        elem.setAttribute('data-tip', null);
        return null;
      }
    }} />
  },

  getColumnHeaders () {
    const { showCheckboxes,
            selectAllChecked,
            handleSelectAllChange,
            haveChildren,
            elementKeyMap,
            columnOrder,
            columnsToShow,
            columnSortedBy,
            sortOrderAscending,
            handleColumnSort,
            sidebarOptions,
            tooltipOnOverflow=true,
            columnHeaderTooltip} = this.props;

    const sortColumnClick = (column, sortable) => {
      if (sortable) {
        if (column === columnSortedBy) {
          handleColumnSort(column, !sortOrderAscending);
        } else {
          handleColumnSort(column, true);
        }
      }
    }

    const getHeaderTooltipText = (elementKeyMap, column) => {
      if (elementKeyMap[column].columnHeaderTooltip) {
        return elementKeyMap[column].columnHeaderTooltip();
      } else if (tooltipOnOverflow) {
        return elementKeyMap[column].columnName;
      } else {
        return null;
      }
    }

    const getCaret = (column) => {
      return (
        <div className="lr-ui-table-column-header-caret-container">
          <UiIcon onClick={() => {}} icon={(columnSortedBy === column && sortOrderAscending ? 'caret-up' : 'caret-down')} color={(columnSortedBy === column ? 'base-green' : 'sidebar-dark')} dimensions={(columnSortedBy === column ? [12,12] : [10, 10])}/>
        </div>
      );
    };
    return (
      <div className={cn('lr-ui-table-column-header-row', { 'sidebar-showing': sidebarOptions })} style={{width: this.containerWidth}}>
        { showCheckboxes ? <div className="lr-ui-table-header-checkbox-container"><UiCheckbox checked={selectAllChecked} handleChange={handleSelectAllChange}/></div> : null }
        { haveChildren ? <div style={{width: "10px", display: 'inline-block'}}></div> : null }
        { _.map(columnOrder, (column, i) => {
          if (_.contains(columnsToShow, column)) {
            var columnWidth = Math.round((elementKeyMap[column].width) / this.totalWidth * 92.0);
            var styleWidth = columnWidth + "%";
            var key = `header-${column}`

            //Default the tooltip to the overflow id, which will be ignored if tooltipOverflow
            var tooltipText = getHeaderTooltipText(elementKeyMap, column);
            var permanentTooltip = !!elementKeyMap[column].columnHeaderTooltip ? 'permanent' : null;

            return (
              <div key={i} className={"lr-ui-column-header-container"} style={elementKeyMap[column].justification ? {textAlign: elementKeyMap[column].justification, width: styleWidth} : {width: styleWidth}}>
                <div onClick={sortColumnClick.bind(null, column, elementKeyMap[column].sortable)} className={cn('lr-ui-table-column-header', {'sorted-by': columnSortedBy === column})}>
                  <div id={key} className='lr-ui-table-column-header-label-container' data-tip={tooltipText} data-for={'uiTableHeaderTooltip'} data-permanent={permanentTooltip}>{ elementKeyMap[column].columnName } </div>
                  { elementKeyMap[column].sortable ? getCaret(column) : null }
                </div>
                <div className={"lr-ui-table-column-header-divider"} >
                  &nbsp;
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  },

  getHeader () {
    const { title,
            elements,
            totalRows,
            elementName,
            hideSearch,
            searchValue,
            handleSearchChange,
            handleSearchEnter } = this.props;

    return (
      <UiHeader
        textTitle={title}
        subHeader={<p>Showing<strong> {elements.length} </strong>of<strong> {totalRows} </strong>{elementName}s</p>}
        rightSideContent={ !hideSearch ?
          <UiSearch
            customStyle={{margin: '0'}}
            inputValue={searchValue}
            placeholder={"Search"}
            hideBorder={true}
            handleChange={handleSearchChange}
            handleEnter={handleSearchEnter}
          /> : null
        }
        />
    );
  },

  getDetailView () {
    const { detailView, sidebarOptions } = this.props;
    let sidebar = '', closeArrow = '';
    if (sidebarOptions) {
      sidebar = (
        <div className="lr-ui-table-detail-view-sidebar-container">
          <UiTableSidebar
            sections={sidebarOptions.sections}
            activeSection={this.state.detailViewSection}
            navigateSection={(section) => this.setState({ detailViewSection: section })}
          />
        </div>
      );
    } else {
      // If no sidebar, still show the old green exit arrow on left
      closeArrow = (
        <div onClick={this.closeDetailView} className='lr-ui-table-detail-view-caret-container'>
          <UiIcon icon='caret-right' color="base-green" dimensions={[15,15]} />
        </div>
      );
    }
    return (
      <div className="lr-ui-table-detail-view">
        <div className="lr-ui-table-detail-view-container">
          { detailView(this.state.detailViewElement, this.state.detailViewSection) }
          <UiIcon icon='cancel' color="white" classes='lr-ui-table-detail-view-clear-icon' dimensions={[20, 20]} onClick={this.closeDetailView}/>
          {closeArrow}
          {sidebar}
        </div>
      </div>
    );
  },

  closeDetailView () {
    this.setState({
      detailViewOpen: false,
      detailViewElement: null,
      detailViewSection: null
    });
  },

  openDetailView(element, section = null) {
    this.setState({ detailViewOpen: true, detailViewElement: element, detailViewSection: section });
  },

  getLoadingRow(i) {
    const { showCheckboxes, haveChildren } = this.props;

    var leftMargin = 0;
    if (showCheckboxes) {
      leftMargin += 28
    }

    if (haveChildren) {
      leftMargin += 7
    }

    var leftMarginStyle = leftMargin + "px";
    return (
      <div key={i} className="lr-ui-table-loading-row" style={{height: '30px', width: '100%'}} >
        <div className="animated-background" style={{marginLeft:leftMarginStyle, height: '8px', top: '4px', display: 'inline-block', width: '12%'}}></div>
        <div className="animated-background" style={{height: '8px', top: '4px', display: 'inline-block', width: '45%'}}></div>
        <div className="animated-background" style={{height: '8px', top: '4px', display: 'inline-block', width: '10%'}}></div>
      </div>
    );
  },

  getLoadingRows() {
    const { loadingRowsCount=20 } = this.props;
    return (
      <div className="lr-ui-table-loading-row-container" >
        { _.times(loadingRowsCount, this.getLoadingRow) }
      </div>
    )

  },

  getFilters () {
    const { headerFilterGroup,
            headerButtonGroup,
            columnsToShow,
            columnOrder,
            handleShowHideColumn,
            elementKeyMap,
            detailView } = this.props;

    const dropdownOptions = _.map(columnOrder, (column) => {
      const onlyOneSelected = columnsToShow.length === 1;
      const selected = _.contains(columnsToShow, column);
      return ({
        text: (
          <div>
            <div style={{display: 'inline-block'}}>
              <UiCheckbox color="grey" value={column} checked={selected} disabled={onlyOneSelected && selected} handleChange={handleShowHideColumn.bind(null, column, !selected)}/>
            </div>
            <div style={{display: "inline-block", marginLeft: '8px'}}>{elementKeyMap[column].columnName}
            </div>
          </div>),
        value: column,
        handleChange: ( onlyOneSelected && selected ? () => {} : handleShowHideColumn.bind(null, column, !selected) )
      })
    })

    return (
      <div className="lr-ui-table-filters-container">
        <div className="lr-ui-table-filter-group-container">{headerFilterGroup}</div>
        <div className="lr-ui-table-button-group-column-selector-container">
          <div className="lr-ui-table-button-group-container">{headerButtonGroup}</div>
          <div className="lr-ui-table-column-selector-container">
            <UiDropdown
              title={<UiIcon icon='admin' color="base-green" dimensions={[22,22]} />}
              options={dropdownOptions}
              tooltipPosition={"right"}
              hideCaret={true}
              />
          </div>
        </div>
        { this.state.detailViewOpen ? this.getDetailView() : null }
      </div>
    );
  },

  getRows () {
    const { loadMoreElements,
            hasMoreElements,
            elements,
            selectedRows,
            expandedRows,
            handleCheckboxChange,
            showCheckboxes,
            haveChildren,
            columnOrder,
            hideDetail,
            toggleChildren,
            columnsToShow,
            customFirstRow,
            showCustomFirstRow,
            elementKeyMap,
            childComponent,
            sidebarOptions,
            tooltipOnOverflow=true } = this.props;

    if (this.state.detailViewElement) {
      var detailedElement = this.state.detailViewElement.id;
    } else {
      detailedElement = null;
    }
    return (
      <div ref={ (rowContainer) => {this.rowContainer = rowContainer; this.addRowContainerScrollListener();} } className="lr-ui-table-row-container" style={{width: this.containerWidth, height: '600px'}}>
        {showCustomFirstRow ? customFirstRow : null}
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMoreElements}
          hasMore={hasMoreElements}
          loader={<div style={{textAlign: 'center', height: '200px'}}>
                <UiLoadingComponent type={'loading'} />
              </div>}
          useWindow={false}
          >
            {_.map(elements, (element, rowNum) => {
              var rowSelected = this.selectedRowsHash[element.id];
              var showChild = _.contains(expandedRows, element.id);
              return (
                <div onClick={showCheckboxes ? this.handleRowClick.bind(null, element, !rowSelected) : null} key={rowNum} onMouseEnter={this.setHoveredElement.bind(null, element)} className={cn('lr-ui-table-row', {'sidebar-showing': sidebarOptions, 'selected': rowSelected}, {'detailed': detailedElement === element.id})}>
                  <div className='lr-ui-table-row-subcomponent-container'>
                    { showCheckboxes ? <div className="lr-ui-table-checkbox-container"><UiCheckbox checked={rowSelected} value={element.id} handleChange={this.handleCheckboxClick.bind(null, element, !rowSelected)}/></div> : null }
                    { haveChildren ? <span className="lr-ui-table-caret-container">
                                        <UiIcon onClick={(e) => {e.stopPropagation(); toggleChildren(element.id);}}
                                                icon={showChild ? 'caret-down' : 'caret-right'}
                                                color={showChild ? 'base-green' : 'sidebar-dark'}
                                                dimensions={[10,10]}/>
                                        </span>
                                    : null }
                    { _.map(columnOrder, (column, colNum) => {
                        if (_.contains(columnsToShow, column)) {
                          var columnWidth = Math.round(elementKeyMap[column].width / this.totalWidth * 92.0);
                          var styleWidth = columnWidth + "%";
                          var key = `${column}-${rowNum}`

                          var tooltipText = null;
                          if (tooltipOnOverflow) {
                            tooltipText = elementKeyMap[column].tooltipDisplay ? elementKeyMap[column].tooltipDisplay(element[column], element) : element[column];
                          }

                          return (
                            <div id={key} key={colNum} className="lr-ui-table-row-subcomponent" style={elementKeyMap[column].justification ? {textAlign: elementKeyMap[column].justification, width: styleWidth} : {width: styleWidth}} data-tip={tooltipText} data-for='uiTableRowTooltip'>
                              {elementKeyMap[column].display ? elementKeyMap[column].display(element[column], element) : <span>{element[column]}</span>}
                            </div>
                          );
                        }
                    })}
                  </div>
                  { !hideDetail ? <div className={cn('ellipsis-holder', { 'sidebar-showing': sidebarOptions })}>
                      <UiIcon icon='ellipses-dark-bg' dimensions={[18, 5]} />
                  </div> : null }
                  { showChild ? childComponent(element) : null}
                </div>
              );
            })}
        </InfiniteScroll>
      </div>
    );
  },

  handleCheckboxClick (element, selected=true) {
    this.props.handleCheckboxChange(element.id, selected);
  },

  handleRowClick (element, selected=true) {
    if (this.state.detailViewOpen) {
      this.setState({
        detailViewElement: element
      });
    } else if (!this.props.disableCheckOnRowClick) {
      this.props.handleCheckboxChange(element.id, selected);
    }
  },

  addRowContainerScrollListener() {
    if (this.rowContainer) {
      this.rowContainer.addEventListener('scroll', this.handleScroll)
      this.scrollListener = true;
    };
  },

  handleScroll () {
    if (this.rowContainer.scrollTop === 0) {
      this.setState({
        hideScrollToTop: true
      })
    } else {
      this.setState({
        hideScrollToTop: false
      })
    }
  },

  setHoveredElement(element) {
    this.setState({ lastHoveredElement: element });
  },

  openDetailViewFromSidebar(section) {
    if (this.state.lastHoveredElement || _.first(this.props.elements)) {
      this.openDetailView(this.state.lastHoveredElement || _.first(this.props.elements), section);
    }
  }
});

export default UiTable;