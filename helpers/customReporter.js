
var logGenerator = require("./logGenerator.js"),
    logger = logGenerator.getApplicationLogger();

exports.customReporter = class customReporter {
    constructor(Page) {
        this.page = Page;
    };

    async info(msg) {        
        logger.info(msg);
    };

    async failed(msg) {        
        logger.info(msg);
    };

    async description(testName) {        
        logger.info(testName);
    };

    

}
