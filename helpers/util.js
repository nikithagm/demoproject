var fs = require('fs');
var logGenerator = require('../helpers/logGenerator'),
logger = logGenerator.getApplicationLogger();

function getRandomString(charLength) {
	var randomText = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < charLength; i++)
		randomText += possible.charAt(Math.floor(Math.random() * possible.length));
	return randomText;
};

async function readFile(filePath) {
	try {
		const data = await fs.promises.readFile(filePath, 'utf8');		
		return JSON.parse(data)
	}
	catch (err) {
		return false;
	}
}

async function writeFile(filename, writedata) {
	try {
		await fs.promises.writeFile(filename, JSON.stringify(writedata, null, 4), 'utf8');		
		return true
	}
	catch (err) {
		return false
	}
}

async function deleteFile (file) {
	try {
		fs.unlinkSync(file)
		logger.info("Succesfully Deleted file " + file)
	} catch(err) {
		console.error(err)
		logger.info("Unable to delete file " + file)
	}
}

function generateRuntimeSpecString(suitesList) {
	var specArray = [];
	var suitesArray = suitesList.split(",");
	var suitesLength = suitesArray.length;
	for (var i = 0; i < suitesLength; i++) {		
		if (suitesArray[i] == "sample")			
			specArray.splice(i, 0, "<rootDir>/e2e/tests/sample.spec.js");		
			
	}
	return specArray;
}

module.exports = { 
	readFile:readFile,
	writeFile:writeFile,
	deleteFile:deleteFile,
	getRandomString:getRandomString,
	generateRuntimeSpecString:generateRuntimeSpecString	
}