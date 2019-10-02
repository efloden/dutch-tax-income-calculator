const assert = require('assert')

// Define all application element getters

// Income
const getGrossIncomeInput = () => $('#input_2').getAttribute("value")
const getInterval = () => $('#select_value_label_0').getText()

const getSocialSecurity = () => $('#socialSecurity').getAttribute("value")
const getOlder = () =>  $('#older65').getAttribute("value")

/**
 * Parse Euro Currency string
 * @param {string} str Euro Curreny amount
 * @returns {int} amount as int 
 */
function parseAmount(str) {
  return parseInt(str.substring(str.indexOf("€") + 2, str.length).replace(',', ''))
}

/**
 * Helper for BVA testing of path two
 * @param {int} grossAmount amount to input into "Gross Income"
 * @param {int} tax expected tax variable
 */
function testSocialTax(grossAmount, tax) {
  browser.url('http://localhost:8080')
  const grossIncomeInput = $('#input_2')
  grossIncomeInput.setValue(grossAmount)
  const amount = parseAmount($('#socialTax').getText())
  // Test against the expected business logic
  const expected = grossAmount > 34300 ? tax : Math.round(grossAmount * tax)
  // Take a screenshot
  browser.saveScreenshot(`${grossAmount}${tax}.png`)
  assert.strictEqual(amount, expected)
}

describe('Dutch Income Tax Calculator Data Flow Path Tests', () => {

    // Path 1 Test Cases

    // Test Case 1.1 - Path 1
    it('Case 1.1: should handle security tax BVA min', () => {
      testSocialTax(1, 0.2765)
    })

    // Test Case 1.2 - Path 1
    it('Case 1.2: should handle security tax BVA just above min', () => {
      testSocialTax(2, 0.2765)
    })

    // Test Case 1.3 - Path 1
    it('Case 1.3: should handle security tax BVA nominal', () => {
      testSocialTax(17150, 0.2765)
    })

    // Test Case 1.4 - Path 1
    it('Case 1.4: should handle security tax BVA just below max', () => {
      testSocialTax(34299, 0.2765)
    })

    // Test Case 1.5 - Path 1
    it('Case 1.5: should handle security tax BVA max', () => {
      testSocialTax(34299, 0.2765)
    })

    // Test Case 1.6 - Path 1
    it('Case 1.6: should handle security Robustness less than min', () => {
      testSocialTax(0, 0.2765)
    })

     // Test Case 1.7 - Path 1
     it('Case 1.7: should handle security Robustness less than min', () => {
      testSocialTax(34301, 9484)
    })

    // Path 2 Test Cases

    // Test Case 2.1 - Path 2
    it('Case 2.1: should handle security tax BVA min', () => {
      testSocialTax(34301, 9484)
    })

    // Test Case 2.2 - Path 2
    it('Case 2.2: should handle security tax BVA just above min', () => {
      testSocialTax(34302, 9484)
    })

    // Test Case 2.3 - Path 2
    it('Case 2.3: should handle security tax BVA nominal', () => {
      testSocialTax(5000000, 9484)
    })

    // Test Case 2.4 - Path 2
    it('Case 2.4: should handle security tax BVA just below max', () => {
      testSocialTax(999999999999, 9484)
    })

    // Test Case 2.5 - Path 2
    it('Case 2.5: should handle security tax BVA max', () => {
      testSocialTax(1000000000000, 9484)
    })

    // Test Case 3 - Path 3
    it('Case 3: should handle socialSecurity set to false path', () => {
      browser.url('http://localhost:8080')
      $('#socialSecurity').click()
      const amount = parseAmount($('#socialTax').getText())
      const expected = 0
      browser.saveScreenshot('case1.png')
      assert.strictEqual(amount, expected)
    })
});