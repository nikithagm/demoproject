const { test, expect } = require('@playwright/test');
const { samplePage } = require('../page/sample.pageObject')
const loginApp = require('../../helpers/globalLogin')
const genericTestData  = require('../../testData/genericData.json');

test.describe("Application Name -Sample Page Test Cases", async() => {

    let page;
    let samplePage1 = new samplePage(page);
    

    /**
     * Test hooks for initiating preconditions at suite and test case level 
     */
   
    test.beforeAll(async ({ browser }) => {        
        page = await login(browser, process.env.ENVIRONMENT_URL, process.env.UI_AUTOMATION_USER, process.env.UI_AUTOMATION_PWD, process.env.GOOGLE_AUTH_SECRET);
        samplePage1 = new samplePage(page);
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.beforeEach(async({}, testInfo) => {
        console.log(`================================Started Test Execution for :  ${testInfo.title}`); 
    })

    test.afterEach(async({}, testInfo) => {
        console.log(`++++++++++++++++++++++++++++++++Completed Test Case Execution | Status  :  ${testInfo.status.toUpperCase()}++++++++++++++++++++`);
    })

     /**
     * Test Cases
     */ 
    test('Validate Service Details and count', async () => {
        const [title, subtitle, pageSections] = await samplePage1.getPageDetails();
        //Soft assertions of playwright
        expect.soft(title).toEqual(genericTestData.samplePageTitle)
        expect.soft(subtitle).toEqual(genericTestData.samplePageSubTitle)
        //Hard assertions of playwright
        expect(pageSections[0]).toEqual(genericTestData.homePageSection1)
        expect(pageSections[1]).toEqual(genericTestData.homePageSection2)
        expect(pageSections[2]).toEqual(genericTestData.homePageSection3)
        expect(pageSections[3]).toEqual(genericTestData.homePageSection4)
        expect(pageSections[4]).toEqual(genericTestData.homePageSection5)
    })

    // test('Search Service and Validate its visible', async () => {
    //     await samplePage1.searchService(genericTestData.searchService)
    //     await samplePage1.verifyServiceCount()
    //     const services = await samplePage1.getDisplayedServices()
    //     expect(services[0]).toEqual(genericTestData.searchService)
    // })
})