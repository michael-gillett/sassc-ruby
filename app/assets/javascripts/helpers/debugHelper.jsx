const DebugHelper = {

  logInternalStackTrace: (responseJSON) => {
    console.groupCollapsed("Internal stack trace:");
    console.log(`Error message: ${responseJSON.error_message ? responseJSON.error_message : "none"}`)
    console.log(responseJSON.backtrace.join('\n'));
    console.groupEnd();
  },

};

export default DebugHelper;
