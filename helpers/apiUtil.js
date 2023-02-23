"use strict";

const httpRequest = require('request-promise');
const request = require('request');
const logGenerator = require("./../helpers/logGenerator"),
logger = logGenerator.getApplicationLogger();
import * as OTPAuth from "otpauth";
const UserName = process.env.aut_user
const Apikey = process.env.apikey
const endpoint_url = process.env.apiurl
    
function exeRequest(opt) {
    return new Promise((resolve, reject) => {
        //logger.info('Calling get with ', JSON.stringify(opt));
        logger.info("Executing rest-post on "+JSON.stringify(opt))
        request.post(opt, function (err, httpResponse, body) {
            if (err || httpResponse.statusCode >= 400) {
                logger.error("Error: http response is "+httpResponse.statusCode);
                logger.error("\n The error (if there was one) in the API call: " + err);
                logger.error(`\n httpResponse is ${JSON.stringify(httpResponse)}`);
                //logger.info("\n Error message: " + JSON.stringify(body));
                const reason = new Error('In exeRequest of apiUtil: API call failed' +
                    ' error: ' + err);
                reject(reason);
            } else {
                resolve(body);
            }
        });
    });
}
    
function exeRequestDelete(opt) {
    return new Promise((resolve, reject) => {
        //logger.info('Calling get with ', JSON.stringify(opt));
        request.delete(opt, function (err, httpResponse, body) {
            if (err || httpResponse.statusCode >= 400) {
                logger.error("Error: http response is "+httpResponse.statusCode);
                logger.error("\n The error (if there was one) in the API call: " + err);
                logger.error(`\n httpResponse is ${JSON.stringify(httpResponse)}`);
                //logger.info("\n Error message: " + JSON.stringify(body));
                const reason = new Error('In exeRequest of apiUtil: API call failed' +
                    ' error: ' + err);
                reject(reason);
            } else {
                resolve(body);
            }
        });
    });
}    
      
/** 
 * Function to prepare the input data for restClient method
 */
async function getApiOptions(http_method, url, apiRequestBody, content_type) {
    let options = {
        headers : {
            'Content-Type' : `application/${content_type}`,
            'Accept' : `application/${content_type}`,
            'Username' : Username,
            'Apikey' : Apikey
        },
        method : http_method,
        url : endpoint_url + url
    }
    if (http_method != 'DELETE')
        options.body = apiRequestBody;

    return options;
}
    
async function restClient(options, callback) {
    return new Promise(function(resolve, reject) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        request(options, function(error, response, body) {
            logger.info(response.statusCode)
            if (error)
                return reject(error);
            if (response.statusCode == 200)
                return resolve(body);
            logger.error("response.body code : " + response.body);
            return reject(createError(response.statusCode, response.body));
        });
    });
}
    
    
async function prepareRestClientInputObject(http_method, url, data, content_type) {
    let options = {
        method: http_method,
        url: url
    }
    if (http_method != 'GET')
        options.body = data;
    return options;
}
    
async function getGoogleAuthPassCode(secretKey) {
    let totp = new OTPAuth.TOTP({
        issuer: "ACME",
        label: "AzureDiamond",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secretKey)
    });
      
    // Generate a token.
    let token = totp.generate();
    return token;  
}

module.exports = {
    exeRequest:exeRequest,
    exeRequestDelete:exeRequestDelete,
    getApiOptions:getApiOptions,
    restClient:restClient,  
    getGoogleAuthPassCode:getGoogleAuthPassCode
};
