"use strict";
const { expect } = require('@playwright/test');
var logGenerator = require("./logGenerator.js"),
    logger = logGenerator.getApplicationLogger();
    
exports.commonMethods = class commonMethods{
    
    constructor(Page) {
        this.page = Page;        
    };

    /**
     * 
     * @param {*} ms Timeout is milliseconds
     * @returns promise object
     */
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
        
    /**
     * Click on first available element
     * @param {*} elmLocator Locator of element
     * @param {*} elemName Name of element
     */
    async click(elmLocator, elemName){
        await Promise.all([
            this.syncWithUi(),
            this.sleep(1000),
            this.page.locator(elmLocator).first().click(),            
            this.syncWithUi(),
            logger.info("Clicked on " + elemName)
        ])
    }
    /**
     * type value in textbox and hit enter button 
     * @param {*} elmLocator Locator of element
     * @param {*} elemName Name of element 
     * @param {*} value value to set in textbox
     */
    async sendKeysEnter(elmLocator, elemName, value) { 
        await Promise.all([
            this.syncWithUi(),        
            this.page.waitForSelector(elmLocator),
            this.page.locator(elmLocator).fill(value),        
            this.page.locator(elmLocator).press("Enter"),       
            logger.info("Entered value : " + value + " in textbox : " + elemName)
        ])     
    }
    /**
     * type value in textbox
     * @param {*} elmLocator Locator of element
     * @param {*} elemName Name of element 
     * @param {*} value value to set in textbox
     */
    async sendKeys(elmLocator, value, elemName) {
        await Promise.all([
            this.syncWithUi(),
            this.page.waitForSelector(elmLocator),
            this.page.locator(elmLocator).fill(value),                  
            logger.info("Entered value : " + value + " in textbox : " + elemName)
        ])        
    }
        
    /**
     * Selecting RadioButtons and checkbox
     * @param {*} elmLocator Locator of element
     * @param {*} elemName Name of element      
     */
    async check(elemLocator, elemName){
        await Promise.all([
            this.syncWithUi(),
            this.page.waitForSelector(elemLocator),
            this.page.locator(elemLocator).check(elemLocator),             
            logger.info("Checked " + elemName)
        ])        
    }
    
    
    /**
     * Get text of element
     * @param {*} elmLocator Locator of element
     * @param {*} elemName Name of element           
     */
    async getText(elmLocator, elmName){
        await this.syncWithUi()         
        await this.page.waitForSelector(elmLocator);        
        var elem = await this.page.$(elmLocator);        
        var txt = await elem.innerText();
        if(elmName != undefined){
            logger.info(elmName  + " : " + txt);
        }        
        return txt;
    }

    /**
     * Get list of all elements matching locator
     * @param {*} elmLocator Locator of element
     * @returns list of all elements
     */
    async getElementsList(elmLocator){        
        await this.syncWithUi();        
        await this.page.waitForSelector(elmLocator);
        return await this.page.$$(elmLocator);
    }

    /**
     * Get specific attribute of webelement
     * @param {*} elemLocator Locator of element
     * @param {*} attrbtName element attribute to return
     * @returns attribute value
     */
    async getAttribute(elemLocator, attrbtName) {        
        await this.page.waitForSelector(elemLocator);
        return await this.page.getAttribute(elemLocator, attrbtName);
    }
   
    /**
     * 
     * @param {*} event load, domcontentloaded,framattached,framedetached,framenavigated etc.Refer documentation
     */
    async waitForEvent(event) {
        if(event != undefined){
            await this.page.waiForEvent(event); 
        }else{//Wait until the page is completely loaded within 3 mins
            await this.page.waiForEvent("load");
        }
        
    }
        
    /**
     * Options are load by default and domcontentloaded, networkidle
     */
    async waitForLoadState() {
        await this.page.waitForLoadState("networkidle")
    }
   
    async syncWithUi (){
        //Wait till spinner loading completes
        await this.page.waitForLoadState();   
    }
    /**
     * Get list of text for from all elements
     * @param {*} elemLocator 
     * @returns array of texts
     */
    async getTextArray(elemLocator){
        await this.syncWithUi()
        var elemList = await this.getElementsList(elemLocator);        
        var textArray = await Promise.all((elemList.map(async (elem, index) => {        
            return await elem.innerText()
        })))
        return textArray;
    }
    /**
     * 
     * @returns Title of page
     */
    async getPageTitle(){
        return await this.page.title();        
    }
    /**
     * Get value from textbox
     * @param {*} elmLocator 
     * @param {*} elemName 
     * @returns Value set in textbox 
     */
    async getTextBoxValue(elmLocator, elemName){
        await this.page.waitForSelector(elmLocator);
        const val =  await this.page.locator(elmLocator).inputValue();       
        logger.info("The default value in textbox" + elemName + " is : " + val) 
        return val    
    }

    /**
     * Get element state 
     * @param {*} elmLocator 
     * @param {*} elementState 
     * @param {*} elemName 
     * @returns boolean value for element state
     */
    async getElementState(elmLocator, elementState, elemName){         
        await this.page.waitForSelector(elmLocator);
        var elem = await this.page.$(elmLocator);
        let elmState = false
        switch (elementState) {
            case "checked":
                elmState = await elem.isChecked()
                break;
            case "enabled":
                elmState = await elem.isEnabled()
                break;
            case "disabled":
                elmState = await elem.isDisabled()
                break;
            case "editable":                
                elmState = await elem.isEditable()
                break;
            case "visible":                
                elmState = await elem.isVisible()
                break;
            case "hidden":                
                elmState = await elem.isHidden()
                break;
            default:
                break;
        }        
        logger.info(elemName  + " : " + elementState + " : " + elmState);               
        return elmState;
    }

    extractNumberFromString(string){
        return parseInt(string.split("(")[1].replace(")",""))
    }

    async switchToFrame(){

    }
    
    /**
     * Wait for loader to dissapear
     */
    async waitForLoaderToComplete() {
		try {
			await this.page.waitForSelector('.bx--loading__svg', { state: "hidden" });
		} catch (error) {
			//throw new Error(`Wait for loader failed: ${error}`);
            logger.info("Loader is not hidden")
		}
	}

}