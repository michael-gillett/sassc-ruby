import { UiHeader, UiInput } from 'liveramp-ui-toolkit';
import GoLinksConstants from 'constants/goLinksConstants';
import GoLinksActions from 'actions/goLinksActions';

var GoLinksCreateForm = React.createClass ({

  render () {
    return (
      <div>
        <UiHeader
          textTitle="Go Links"
          helpText="go go go go go."
        />
      </div>
    );
  }
});

export default GoLinksCreateForm;
