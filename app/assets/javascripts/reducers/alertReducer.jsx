import AlertsConstants from 'constants/alertsConstants';

const defaultState = {
  showing: false,
  alertType: null,
  message: null,
  permanent: false
};

function AlertsReducer(state = defaultState, action) {
  switch (action.type) {
    case AlertsConstants.OPEN_ALERT:
      return { showing: true, alertType: action.alertType, message: action.msg, permanent: action.permanent };

    case AlertsConstants.CLOSE_ALERT:
      return defaultState;

    default:
      return state;
  }
}

export default AlertsReducer;
