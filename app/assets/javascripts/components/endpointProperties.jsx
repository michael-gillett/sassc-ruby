import { UiTitle, UiLabel } from 'liveramp-ui-toolkit';
import RequiredTaxonomyPropertyListRow from 'components/requiredTaxonomyPropertyListRow';
import RequiredTaxonomyPropertyListHeader from 'components/requiredTaxonomyPropertyListHeader';
import ReactTooltip from 'react-tooltip';

var EndpointProperties = React.createClass ({

  render () {
    const isEmpty = _.isEmpty(this.props.properties);
    return (
      <div className="titled-form-section">
        <UiTitle
          textTitle="Properties"
          />
        <div className="form-input-container">
          <UiLabel
            label={"Required Properties:"}
            />
          <br/>
          { this.props.editMode &&
            <button className="button add-required-properties-button" onClick={this.props.actions.addNewProperty}>
              + Add Required Property
            </button>
          }
          <div>
            { !isEmpty && <RequiredTaxonomyPropertyListHeader/> }
            <div className={classNames({'required-properties-table': !isEmpty})}>
              { this.getRequiredTaxonomyProperties() }
            </div>
          </div>
        </div>
        <ReactTooltip effect="solid" place="top"/>
      </div>
    );
  },

  getRequiredTaxonomyProperties() {
    if (this.props.editMode) {
      return _.map(this.props.properties, (property) => {
        const id = property.id || property.key;
        return <RequiredTaxonomyPropertyListRow
          key={property.key}
          id={id}
          name={property.name}
          nameValid={this.nameValid(property)}
          descriptionValid={this.descriptionValid(property)}
          description={property.description}
          editMode={true}
          onChangeName={(event) => this.props.actions.updateNameField(id, event.target.value)}
          onChangeDescription={(event) => this.props.actions.updateDescriptionField(id, event.target.value)}
          onDelete={() => this.props.actions.deleteRow(id)}
          />;
      });
    } else {
      return _.map(this.props.properties, (property) => {
        const id = property.id || property.key;
        return <RequiredTaxonomyPropertyListRow
          key={property.key}
          id={id}
          name={property.name}
          description={property.description}
          />;
      });
    }
  },

  nameValid(property) {
    let nameCount = 0;
    _.each(this.props.properties, (p) => {
      if (property.name === p.name) {
        nameCount++;
      }
    });
    return nameCount === 1 && property.name;
  },

  descriptionValid(property) {
    return property.description;
  },

});

export default EndpointProperties;
