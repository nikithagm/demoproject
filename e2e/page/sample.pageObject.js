"use strict";

const { expect } = require('@playwright/test');
const { commonMethods } = require('../../helpers/commonMethods');
let page, 
commonUiMethods = new commonMethods(page);

/**
 * Define Locators on page like xpath,css etc.
 * Naming convention --> elementNameElementTypeLocatorType 
 */

var locatorsConfig = {    
    pageTitleTextCss: ".header_nav span:nth-child(2)", 
    pageSubtitleTextCss : "h1",
    pageSectionsTextCss : "h3",
    taskNameLinkByText : "//div[contains(text(), '%s')]"   
};

exports.samplePage = class samplePage{
    
    constructor(Page) {        
        page = Page; 
        commonUiMethods = new commonMethods(page);     
    };
    
    /**
     * Sample Page object methods utilising locators and commonUiMethods
     * 
     */

    async getPageDetails(){
        const title = await commonUiMethods.getText(locatorsConfig.pageTitleTextCss, "Main Title")
        const subtitle = await commonUiMethods.getText(locatorsConfig.pageSubtitleTextCss, "Page Subtitle")
        const pageSections = await commonUiMethods.getTextArray(locatorsConfig.pageSectionsTextCss, "Page Sub-Sections")
        return [title, subtitle, pageSections]
    }

    /**
     * 
     * @param {*} taskName Task name to be clicked from home page
     */
    async selectTask(taskName){
        await commonUiMethods.click(locatorsConfig.taskNameLinkByText.replace("%s", taskName), "Task")
    }

    // async searchService(serviceName){
    //     await commonUiMethods.sendKeysEnter(locatorsConfig.searchServicesCss, "Search Any Service", serviceName)
    //     await commonUiMethods.click(locatorsConfig.searchBtn,"Search Button")
    // }
    
    // async verifyServiceCount(){
    //     const viewingCount = await this.getViewingCount()
    //     const serviceCardsCount = await this.getCountOfDisplayedServices()
    //     expect(parseInt(viewingCount)).toEqual(serviceCardsCount)
    // }
}