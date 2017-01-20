var RequiredTaxonomyPropertyListHeader = React.createClass({

  render () {
    return (
      <div className='required-taxonomy-property-header'>
        <div className='col-xs-2 required-taxonomy-properties-header-field'>
          Name
        </div>
        <div className='col-xs-10 required-taxonomy-properties-header-field'>
          Description
        </div>
      </div>
    );
  },

});

export default RequiredTaxonomyPropertyListHeader;
