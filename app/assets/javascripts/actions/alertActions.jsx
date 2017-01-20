import AlertsConstants from 'constants/alertsConstants';

const AlertsActions = {
  openAlert (alertType, msg, permanent=false) {
    return { type: AlertsConstants.OPEN_ALERT, alertType, msg, permanent };
  },

  closeAlert () {
    return { type: AlertsConstants.CLOSE_ALERT };
  },
};

export default AlertsActions;
