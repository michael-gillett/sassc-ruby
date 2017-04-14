import { UiFilterGroup } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';

const GoLinksFilterGroup = React.createClass({

  render() {
    const { selectedOwner, ownerOptions, handleChange } = this.props;

    const filters = [
      {
        name: GoLinksConstants.FILTER_OWNER,
        selectOptions: ownerOptions,
        selected: selectedOwner,
        isMulti: false,
      }
    ];

    return (
      <UiFilterGroup
        filterParams={filters}
        handleChange={handleChange}
        hideClearAll={true}
      />
    );
  }

});

export default GoLinksFilterGroup;
