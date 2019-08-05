const assert = require('assert')

// Define all application element getters

// Income
const getGrossIncomeInput = () => $('#input_2').getAttribute("value")
const getInterval = () => $('#select_value_label_0').getText()

// Amounts
// taxableYear = $('#taxableYear') (text)
// payrollTax = $('#payrollTax') (text)
// socialTax = $('#socialTax') (text)
// generalCredit = $('#generalCredit') (text)
// labourCredit = $('#labourCredit') (text)
// netYear = $('#netYear') (text)
// netMonth = $('#netMonth') (text)

// Options
const getCalendarYear = () => {
    const years = [
        {"2015": $('#year-2015').getAttribute("value")},
        {"2016": $('#year-2016').getAttribute("value")},
        {"2017": $('#year-2017').getAttribute("value")},
        {"2018": $('#year-2018').getAttribute("value")},
        {"2019": $('#year-2019').getAttribute("value")}
    ]
    // Find the selected year radio
    return Object.keys(years.find(y => y))[0]
}

// socialSecurity = $('#socialSecurity') (value)
// older65 = $('#older65') (value)

// 30PerRuling = $('#30PerRuling') (value)
// rulingChecked = $('#rulingChecked') (value)
// scientificResearch = $('#scientificResearch') (value)
// youngEmployee = $('#youngEmployee') (value)
// otherRuling = $('#otherRuling') (value)

/**
 * Determine the selected ruling
 */
const getOtherRuling = () => {
  const rulingType = [
      {"scientificResearch": $('#scientificResearch').getAttribute("value")},
      {"youngEmployee": $('#youngEmployee').getAttribute("value")},
      {"otherRuling": $('#otherRuling').getAttribute("value")}
  ]
  // Find the selected ruling radio
  return Object.keys(rulingType.find(y => y))[0]
}

/**
 * Parse Euro Currency string
 * @param {string} str Euro Curreny amount
 * @returns {int} amount as int 
 */
function parseAmount(str) {
  return parseInt(str.substring(str.indexOf("€") + 2, str.length).replace(',', ''))
}

describe('Dutch Income Tax Calculator tests', () => {
  
    it('should have the right title', () => {
      browser.url('http://localhost:8080')
      const title = browser.getTitle()
      assert.strictEqual(title, 'Dutch Income Tax Calculator')
    })
    it('should start as 36000 gross income', () => {
      browser.url('http://localhost:8080')
      assert.strictEqual(getGrossIncomeInput(), '36000')
    })
    it('should get correct year', () => {
      browser.url('http://localhost:8080')
      assert.strictEqual(getCalendarYear(), '2015')
    })

    it('should handle minimum Gross Income input', () => {
      browser.url('http://localhost:8080')
      const grossIncomeInput = $('#input_2')
      grossIncomeInput.setValue('1')
      assert.strictEqual($('#netYear').getText(), '€ 1')
    })
    it('should handle maximum Gross Income input', () => {
      browser.url('http://localhost:8080')
      const grossIncomeInput = $('#input_2')
      // Input Max Safe INT
      grossIncomeInput.setValue(900719925474099)
      assert.strictEqual($('#netYear').getText(), '€ 414,473,990')
    })

    // Boundary Value Analysis for Security Tax value calculation

    it('should handle security tax BVA min', () => {
      browser.url('http://localhost:8080')
      const grossIncomeInput = $('#input_2')
     
      const grossAmount = 1
      const rate = 0.2765
      grossIncomeInput.setValue(grossAmount)
      const amount = parseAmount($('#socialTax').getText())
      const expected = Math.trunc(grossAmount * rate)
      assert.strictEqual(amount, expected)
    })

    it('should handle security tax BVA just above min', () => {
      browser.url('http://localhost:8080')
      const grossIncomeInput = $('#input_2')
      
      const grossAmount = 2
      const rate = 0.2765
      grossIncomeInput.setValue(grossAmount)
      const amount = parseAmount($('#socialTax').getText())
      const expected = Math.trunc(grossAmount * rate) + 1
      assert.strictEqual(amount, expected)
    })

    it('should handle security tax BVA nominal', () => {
      browser.url('http://localhost:8080')
      const grossIncomeInput = $('#input_2')

      const grossAmount = 17150
      const rate = 0.2765
      grossIncomeInput.setValue(grossAmount)
      const amount = parseAmount($('#socialTax').getText())
      const expected = Math.trunc(grossAmount * rate) + 1
      assert.strictEqual(amount, expected)
    })

    it('should handle security tax BVA just below max', () => {
      browser.url('http://localhost:8080')
      const grossIncomeInput = $('#input_2')

      const grossAmount = 34299
      const rate = 0.2765
      grossIncomeInput.setValue(grossAmount)
      const amount = parseAmount($('#socialTax').getText())
      const expected = Math.trunc(grossAmount * rate) + 1
      console.log(amount)
      assert.strictEqual(amount, expected)
    })

    it('should handle security tax BVA max', () => {
      browser.url('http://localhost:8080')
      const grossIncomeInput = $('#input_2')

      const grossAmount = 34300
      const rate = 0.2765
      grossIncomeInput.setValue(grossAmount)
      const amount = parseAmount($('#socialTax').getText())
      const expected = Math.trunc(grossAmount * rate) + 1
      console.log(amount)
      assert.strictEqual(amount, expected)
    })

    // Pensioners BVA

    it('should handle pensioner security tax BVA nominal', () => {
      browser.url('http://localhost:8080')
      const grossIncomeInput = $('#input_2')
      // Set as Pensioner (older65)
      $('#older65').click()
      
      const grossAmount = 1
      const rate = 0.0975
      grossIncomeInput.setValue(grossAmount)
      const amount = parseAmount($('#socialTax').getText())
      const expected = Math.trunc(grossAmount * rate)
      assert.strictEqual(amount, expected)
    })

    // Robustness Tests

    // Worst case testing
});