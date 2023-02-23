
"use strict";
function getApplicationLogger(){	  
	var log4js = require("log4js");
	//For Parallel Test execution, separate log files are required.
	//For this, we are using worker id of jest which is unique
	log4js.configure({
		"appenders": {
		  "out": {"type": "stdout","layout": { "type": "coloured" } },
		  "app": {"type": "dateFile",
				  "filename": "./test-results/executionlogs/" + process.env.TEST_PARALLEL_INDEX + "-application.log",
				  "maxLogSize": 10485760,
				  "layout":
					  {"type":"pattern",
					   "pattern":"[%d{dd-MM-yyyy hh:mm:ss}] [%p] - %m",
					   "tokens": {"user": "function(logEvent) {return AuthLibrary.currentUser();"}}
					  }
				  },
		"categories": {
		  "default": { "appenders": ["out","app"], "level": "info" }
		}
	  })



	var logger = log4js.getLogger();	
	return logger;

}
module.exports = {
	getApplicationLogger:getApplicationLogger
};