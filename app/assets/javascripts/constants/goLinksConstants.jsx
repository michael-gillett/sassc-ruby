export default {
  SET_ALIAS: "SET_ALIAS",
  SET_URL: "SET_URL",
  SET_DESCRIPTION: "SET_DESCRIPTION",
  UPDATE_SEARCH: "UPDATE_SEARCH",

  POPULATE_EDIT_INFO: "POPULATE_EDIT_INFO",
  POPULATE_ALIAS_INFO: "POPULATE_ALIAS_INFO",
  CLEAR_EDIT_INFO: "CLEAR_EDIT_INFO",

  GO_LINKS_FETCH: "GO_LINKS_FETCH",
  GO_LINK_UPDATING: "GO_LINK_UPDATING",
  GO_LINK_SAVING: "GO_LINK_SAVING",
  GO_LINK_DELETING: "GO_LINK_DELETING",
  DELETE_CONFIRMATION: "DELETE_CONFIRMATION",

  // Filter Constants
  QUERY_PARAMS_UPDATED: "QUERY_PARAMS_UPDATED",
  UPDATE_FILTERED_LIST: "UPDATE_FILTERED_LIST",
  FILTER_OWNER: "Owner",
  FILTER_OWNER_ALL: 'all',
  FILTER_OWNER_MY_LINKS: 'owned_by_me',
  FILTER_OWNER_OPTIONS: [
    { label: 'All', value: 'all' },
    { label: 'Owned By Me', value: 'owned_by_me' }
  ],
  DEFAULT_QUERY_PARAMS: {
    owner: 'all',
    search_query: ''
  }
};
