var MacroTable = React.createClass({

  render () {
    return (
      <div className="macro-table">
        {this.getList()}
      </div>
    );
  },

  getList () {
    let macroList = [];
    _.each(this.props.macroList, (value, key) => {
      macroList.push(
        <div className="row macro-table-row" key={key}>
          <div className="col-xs-4">
            {value.label}
          </div>
          <div className="col-xs-8">
            {value.description}
          </div>
        </div>
      )
    });
    return macroList;
  },

});

export default MacroTable;
