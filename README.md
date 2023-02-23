UI AUTOMATION
UI Test Automation using Playwright and Node.js

Pre-requisites:
Install npm 16 or higher version on system
for required packages read package.json and for installation run this command on terminal:
npm install

Structure of framework:
playwright.config.js : It is the configuration file that contains playwright configurations like browser type, headless or headed execution, test file to run , timeout, baseUrl of environment etc.
credentials.json : Environment details along with user credentials(username, pwd).
test cases are created under the e2e/tests folder
page object action methods are  under e2e/page folder. In page object user has to define and locator and pass it to relevant method of commonMethods module as argumnet
test data files are stored under testData folder 
    genericData.json contains generic or global test data which can be used accross different tests and generic functions. 
    timeouts.json contains custom timeout for elements, pages, ui events etc.
Core functionalities like playwright methods, logs, login are under helper folder
At the end of execution html report will get generate under playwright-report folder. 
Execution logs, screenshot of failed test case and trace file can be viewed from test-results folder

Test Execution
Update credentials.json file with user login details
In playwright.config.js, update baseUrl and other config if required
From terminal, hit this command - npx playwrite test

Test Execution can also be done using VS code plugin
Install plugin Playwright Test for VS Code
Select Testing button, it will display the test suites from tests folder
Select the suite you want to run.
