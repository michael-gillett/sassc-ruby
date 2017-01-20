import TaxonomyEndpointListRow from 'components/taxonomyEndpointListRow';
import TaxonomyEndpointListHeader from 'components/taxonomyEndpointListHeader';
import { UiHeader, UiLoadingComponent, UiSearch } from 'liveramp-ui-toolkit';
import TaxonomyEndpointConstants from 'constants/taxonomyEndpointConstants';
import SortingConstants from 'constants/sortingConstants';
import ReactTooltip from 'react-tooltip';
import TaxonomyEndpointActions from 'actions/taxonomyEndpointActions';
import AlertActions from 'actions/alertActions';

var TaxonomyEndpointList = React.createClass ({

  getInitialState() {
    return { sortingMechanism: SortingConstants.SORT_BY_ID_DESCENDING };
  },

  render () {
    return (
      <div>
        <UiHeader
          textTitle="Taxonomy Endpoints"
          helpText="Here's where you can create and manage your taxonomy endpoints."
          rightSideContent={
            <div className='endpoint-list-search'>
              <UiSearch
                inputValue={this.props.taxonomyEndpoint.searchInputValue}
                placeholder={"Search"}
                handleChange={(event) => this.props.taxonomyEndpointActions.updateSearchInput(event.target.value)}
                />
            </div>
          }
          />
        <button onClick={() => this.props.taxonomyEndpointActions.redirect("/new")} className="button">
          + New Endpoint
        </button>
        { this.getBody() }
        <ReactTooltip effect="solid" place="top"/>
      </div>
    );
  },

  getBody () {
    if (this.props.taxonomyEndpoint.endpointFetchStatus === TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_LOADING) {
      return <UiLoadingComponent/>;
    } else if (this.props.taxonomyEndpoint.endpointFetchStatus === TaxonomyEndpointConstants.ENDPOINT_LIST_FETCH_FAILURE) {
      return <UiLoadingComponent
        type='error'
        message={<p>{"Failed to fetch endpoints. Click to retry."}</p>}
        retryCallback={this.props.taxonomyEndpointActions.fetchTaxonomyEndpoints}
        />;
    } else if (_.isEmpty(this.props.taxonomyEndpoint.originalEndpointList)) {
      return (
        <div className='no-configured-sources'>
          <h2 className='no-configured-sources-text' onClick={this.props.taxonomyEndpointActions.fetchTaxonomyEndpoints} >No taxonomy endpoints found.</h2>
        </div>
      );
    } else {
      return (
        <div className='endpoint-list-container'>
          <TaxonomyEndpointListHeader
            onClickId={this.onClickHeaderIdColumn}
            onClickName={this.onClickHeaderNameColumn}
            sortingMechanism={this.state.sortingMechanism}
            />
          <div className='endpoint-table'>
            { this.getEndpointRows() }
          </div>
        </div>
      );
    }
  },

  getEndpointRows () {
    let endpoints = [];
    _.each(this.props.taxonomyEndpoint.originalEndpointList, (endpoint) => {
      if (endpoint.name.toLowerCase().includes(this.props.taxonomyEndpoint.searchInputValue.toLowerCase())) {
        endpoints.push(
          <TaxonomyEndpointListRow
            key={endpoint.id}
            id={endpoint.id}
            name={endpoint.name}
            redirect={this.props.taxonomyEndpointActions.redirect}
            />
        );
      }
    });
    if (_.isEmpty(endpoints)) {
      return (
        <div className='endpoint-row'>
          <p id='no-endpoints-found-text'>No endpoints found</p>
        </div>
      );
    } else {
      return this.sortEndpoints(endpoints);
    }
  },

  sortEndpoints(endpoints) {
    switch (this.state.sortingMechanism) {

      case SortingConstants.SORT_BY_ID_DESCENDING:
        return _.sortBy(endpoints, (endpoint) => {
          return -(endpoint.props.id);
        });

      case SortingConstants.SORT_BY_NAME_ASCENDING:
        return _.sortBy(endpoints, (endpoint) => {
          return (endpoint.props.name.toLowerCase());
        });

      case SortingConstants.SORT_BY_NAME_DESCENDING:
        return _.sortBy(endpoints, (endpoint) => {
          return (endpoint.props.name.toLowerCase());
        }).reverse();

      case SortingConstants.SORT_BY_ID_ASCENDING:
      default:
        return endpoints;
    }
  },

  onClickHeaderIdColumn() {
    if (this.state.sortingMechanism === SortingConstants.SORT_BY_ID_DESCENDING) {
      this.setSortingMechanism(SortingConstants.SORT_BY_ID_ASCENDING);
    } else {
      this.setSortingMechanism(SortingConstants.SORT_BY_ID_DESCENDING);
    }
  },

  onClickHeaderNameColumn() {
    if (this.state.sortingMechanism === SortingConstants.SORT_BY_NAME_DESCENDING) {
      this.setSortingMechanism(SortingConstants.SORT_BY_NAME_ASCENDING);
    } else {
      this.setSortingMechanism(SortingConstants.SORT_BY_NAME_DESCENDING);
    }
  },

  setSortingMechanism(mechanism) {
    this.setState({ sortingMechanism: mechanism });
  },

  deleteEndpoint(endpointId) {
    // this is unused currently, but we're saving it in case we wish to add delete functionality later
    const message = (
      <p>{"Are you sure you want to delete this endpoint? "}
        <span onClick={() => this.props.actions.deleteEndpoint(endpointId)} className='alert-action-text'>
          {"Delete this endpoint."}
        </span>
      </p>
    );
    this.props.alertActions.openAlert(AlertsConstants.ALERT_TYPES.WARNING, message, true);
  },

});

const mapStateToProps = function(state) {
  return {
    taxonomyEndpoint: state.taxonomyEndpoint,
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    taxonomyEndpointActions: Redux.bindActionCreators(TaxonomyEndpointActions, dispatch),
    alertActions: Redux.bindActionCreators(AlertActions, dispatch),
  };
};

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(TaxonomyEndpointList);
