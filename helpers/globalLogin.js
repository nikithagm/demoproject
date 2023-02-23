let logGenarator = require('../helpers/logGenerator'),
    logger = logGenarator.getApplicationLogger();
let fs = require('fs').promises;
let cookiesFile = './Cookies/state.json';
let apiUtil = require('../helpers/apiUtil');

let locatorConfig = {
    btnLoginIbmIdXpath : "//button[contains(text(), 'IBMid')]",
    txtBoxuserNameCss : "input[type='text']",
    btnContinueCss:"text='Continue'",
    txtboxPwdCss:"input[type='password']",
    btnLoginCss:"button:has-text('Log in')",
    btnIAccpetCss:"text=I Accept",
    txtOtpCss:"#otp",
    btnVerifyPasscodeCss:"button[type='submit']",
    textInvalidOtpCss : "div[data-invalid]"
}

/**
 * Function for invoking application with authenticated user
 * @param {*} browser Instance of browser fixture available at test level
 * @param {*} url Application url
 * @returns instance of playwright page that is used for calling playwright methods * 
*/

global.authenticateUser = async function (browser, url) {
    const context = await browser.newContext({
        httpCredentials: {
            username: process.env.UI_BASIC_AUTH_USER,
            password: process.env.UI_BASIC_AUTH_PASSWORD
        }
    })
    const page = await context.newPage()
    await page.goto(url);
    logger.info("Navigated to " + url);
    return page;
}

/**
 * Login to application using cookies stored after first login, helpful to avoid multiple login attempts.
 * The main function calling this function must have handling for cookies file,if it exist then only login
 * using cookies otherwise execute this function. Use like below format in main function
 * Create a new context with the saved storage state/cookies.              
    context = await browser.newContext({ storageState: logincookiesFile });
    page = await context.newPage();
    //Close original context
    await browser.contexts()[0].close();       
    await page.goto(url);  
 * @param {*} url Application url
 * @param {*} userName username for application login
 * @param {*} pwd password for application login 
*/

global.login = async function (browser, url, userName, pwd, googleAuthenticationSecret) {
    //Delete cookies file if any
    try {
        await fs.unlink(cookiesFile);
        logger.info('successfully deleted session cookies file');
    } catch (error) {
        logger.info('there was an error while deleting session cookies file :', error.message);
    }
    const context = await browser.newContext()
    const page = await context.newPage() 
    await page.goto(url);
    logger.info("Navigated to " + url);

    await page.click(locatorConfig.btnLoginIbmIdXpath)
    logger.info("Clicked on Sign In with Ibm Id button");

    // Fill input[type="text"]
    await page.fill(locatorConfig.txtBoxuserNameCss, userName);
    logger.info("Entered username : " + userName);

    // Click text=Continue
    await page.click(locatorConfig.btnContinueCss);
    logger.info("Clicked on continue button");

    // Fill input[type="password"]
    await page.fill(locatorConfig.txtboxPwdCss, pwd);
    logger.info("Entered password : " );

    // Click button:has-text("Log in")
    await page.click(locatorConfig.btnLoginCss);
    logger.info("Clicked on Login button");

    // Enter Google Authenticator code    
    let counter = 10;
    while (counter > 1) {
        let passCode = await apiUtil.getGoogleAuthPassCode(googleAuthenticationSecret);
        await page.fill(locatorConfig.txtOtpCss, passCode);
        await page.click(locatorConfig.btnVerifyPasscodeCss);
        let flag = await page.isVisible(locatorConfig.textInvalidOtpCss);
        if(flag){
            commonUiMethods.sleep(60);
            passCode = await apiUtil.getGoogleAuthPassCode(googleAuthenticationSecret);
            await page.fill(locatorConfig.txtOtpCss, passCode);
            await page.click(locatorConfig.btnVerifyPasscodeCss);
            flag = await page.isVisible(locatorConfig.textInvalidOtpCss);
            if(!flag){
                break;
            }else{
                counter = counter-1;
            }
        }else{
            break;
        }        
    }
    
    // Click text=I Accept
    await Promise.all([
        page.waitForNavigation(),
        page.click(locatorConfig.btnIAccpetCss),
        logger.info("Clicked on I Accept button")
    ]);

    await page.context().storageState({ path: cookiesFile });
    await page.setViewportSize({width: 1280, height: 650});
    return page;
};


/**
 * Login to Application with Authenticated user and Google authentication key
 * @param {*} browser Instance of browser fixture
 * @param {*} url Application url
 * @param {*} userName 
 * @param {*} pwd 
 * @param {*} googleAuthenticationSecret The secert key of Google authenticator for the user
 * @returns instance of playwright page that is used for calling playwright methods
 */
global.loginToPortal = async function(browser, url, userName, pwd, googleAuthenticationSecret) { 
    const context = await browser.newContext({
        httpCredentials: {
            username: process.env.UI_BASIC_AUTH_USER,
            password: process.env.UI_BASIC_AUTH_PASSWORD
        }
    })    
    const page = await context.newPage()   
    await page.goto(url);     
    logger.info("Navigated to " + url);
    const commonUiMethods = new commonMethods(page); 
    await commonUiMethods.sleep(5);
    await commonUiMethods.click(locatorConfig.btnSignInCss, "Login")
    await commonUiMethods.sendKeys(locatorConfig.txtBoxuserNameXpath, userName, "User Name")
    await commonUiMethods.click(locatorConfig.btnNextCss, "Next")
    await commonUiMethods.sendKeys(locatorConfig.txtboxPwdCss, pwd, "Password")
    await commonUiMethods.click(locatorConfig.btnVerifyCss, "Verify")
    await commonUiMethods.click(locatorConfig.btnGoogleAuthenticatorCss, "Google Authenticator")
    //Get Authentication code    
    let counter = 10;
    while (counter > 1) {       
        let passCode = await apiUtil.getGoogleAuthPassCode(googleAuthenticationSecret);
        await page.fill(locatorConfig.txtBoxOtpCss, passCode);
        await page.click(locatorConfig.btnVerifyCss);
        let flag = await page.locator(locatorConfig.textInvalidOtpCss).isVisible();        
        if(flag){
            commonUiMethods.sleep(60);
            passCode = await apiUtil.getGoogleAuthPassCode(googleAuthenticationSecret);
            await commonUiMethods.sendKeys(locatorConfig.txtBoxOtpCss, passCode, "Google Authentication Code")
            await commonUiMethods.click(locatorConfig.btnVerifyCss, "Verify")
            flag = await page.isVisible(locatorConfig.textInvalidOtpCss);
            if(!flag){
                break;
            }else{
                counter = counter-1;
            }
        }else{
            break;
        }        
    }
    await commonUiMethods.sleep(6000);
    await expect(page.locator(locatorConfig.textSignOut)).toBeVisible();    
    return page;  
};








