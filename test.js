require("chromedriver");
const assert = require("assert");
const { Builder, By, until } = require("selenium-webdriver");

const url = "https://itk-qa-exams.itekako.com/";
const divParent = "div[class='main flex-center'] ";
const divChildValuesQ = "div[class='\"value\"']";
const divChildValues = "div[class='value']";
const divChildResultQ = "div[class='\"result\"']";
const divChildResult = "div[class='result']";

const getValues = async elements => {
  const promises = elements.map(el => el.getText());
  const values = await Promise.all(promises);
  return values;
};

const count = (numbers, operation) => {
  let total = Number(numbers[0]);
  for (let i = 1; i < numbers.length; i++) {
    if (operation[i] == "+") {
      total += Number(numbers[i]);
    } else if (operation[i] == "-") {
      total -= Number(numbers[i]);
    } else if (operation[i] == "*") {
      total *= Number(numbers[i]);
    } else if (operation[i] == "/") {
      total /= Number(numbers[i]);
    }
  }
  return total;
};

const round = total => {
  if (total % 1 !== 0) {
    return Math.round(total * 100) / 100;
  } else {
    return total;
  }
};

const isPalindrome = wordArr => {
  const numForSlice = (wordArr.length / 2) | 0;
  let testResult = "Yes";
  for (let i = 0; i < numForSlice; i++) {
    if (wordArr[i] !== wordArr[wordArr.length - 1 - i]) {
      testResult = "No";
    }
  }
  return testResult;
};

describe("Tests", function() {
  let driver;
  before(async function() {
    driver = await new Builder().forBrowser("chrome").build();
  });

  it("Exam #1 - Validate sum of 5 integers", async function() {
    await driver.get(`${url}first`);

    const elements = await driver.findElements(
      By.css(divParent + divChildValuesQ)
    );
    const numbers = await getValues(elements);
    const testResult = numbers.reduce((total, num) => total + Number(num), 0); // the total has to be initilazed. If not, the first time in iteration, it is a string
    let result = await driver
      .findElement(By.css(divParent + divChildResultQ))
      .getText();
    result = Number(result);
    assert.equal(
      testResult,
      result,
      `Exam #1 ERROR: Values: ${numbers}, Actual result: ${testResult}, Expected: ${result};`
    );
  });

  it("Exam #2 - Validate result of 5 integers and random operation(- or + or * or /)", async function() {
    await driver.get(`${url}second`);

    const spans = await driver.findElements(By.css(divParent + "span"));
    const operation = await getValues(spans);
    operation.unshift("0");
    const elements = await driver.findElements(
      By.css(divParent + divChildValuesQ)
    );
    const numbers = await getValues(elements);
    let result = await driver
      .findElement(By.css(divParent + divChildResultQ))
      .getText();
    result = Number(result);
    let testResult = count(numbers, operation);
    testResult = round(testResult);

    assert.strictEqual(
      testResult,
      result,
      `Exam #2 ERROR: Values: ${numbers}, Operands: ${operation}, Actual result: ${testResult}, Expected: ${result};`
    );
  });

  it("Exam #3 - Validate result of variable number of operands and fixed operation (multiplication)", async function() {
    await driver.get(`${url}third`);

    const elements = await driver.findElements(
      By.css(divParent + divChildValuesQ)
    );
    const numbers = await getValues(elements);
    const testResult = numbers.reduce((total, num) => {
      return total * Number(num);
    }, 1);
    let result = await driver
      .findElement(By.css(divParent + divChildResultQ))
      .getText();
    result = Number(result);
    assert.strictEqual(
      testResult,
      result,
      `Exam #3 ERROR: Values: ${numbers}, Actual result: ${testResult}, Expected: ${result};`
    );
  });

  it("Exam #4 - Validate result of variable number of operands and alternates between multiplication and division operators", async function() {
    await driver.get(`${url}/fourth`);

    const spans = await driver.findElements(By.css(divParent + "span"));
    const operation = await getValues(spans);
    operation.unshift("0");
    const elements = await driver.findElements(
      By.css(divParent + divChildValuesQ)
    );
    const numbers = await getValues(elements);
    let result = await driver
      .findElement(By.css(divParent + divChildResultQ))
      .getText();
    result = Number(result);
    let testResult = count(numbers, operation);
    testResult = round(testResult);

    assert.strictEqual(
      testResult,
      result,
      `Exam #4 ERROR: Values: ${numbers}, Operands: ${operation}, Actual result: ${testResult}, Expected: ${result};`
    );
  });

  it("Exam #5 - Validate palindrome", async function() {
    await driver.get(`${url}fifth`);

    const wordEl = await driver.findElement(By.css(divParent));
    const word = await wordEl.getText();
    const resultEl = await driver.findElement(By.id("result"));
    const result = await resultEl.getText();
    const wordArr = word.toLowerCase().split("");
    const testResult = isPalindrome(wordArr);

    assert.strictEqual(
      testResult,
      result,
      `Exam #5 ERROR: Word: ${wordArr.join(
        ""
      )}, Actual result: ${testResult}, Expected result: ${result};`
    );
  });

  it("Exam #6 - Validate individual letter count", async function() {
    await driver.get(`${url}sixth`);

    let lettersEl = await driver.findElements(By.css("td:nth-child(1)"));
    let letters = await getValues(lettersEl);

    let lettersCountEl = await driver.findElements(By.css("td:nth-child(2)"));
    let lettersCount = await getValues(lettersCountEl);

    const resultObj = {};
    for (let i = 0; i < lettersCount.length; i++) {
      resultObj[letters[i]] = lettersCount[i];
    }

    const assignedWordEl = await driver.findElement(By.id("word")).getText();
    let assignedWordPromise = await Promise.resolve(assignedWordEl);
    const assignedWord = assignedWordPromise.split("");

    const countLetters = {};
    assignedWord.forEach(letter => {
      if (!countLetters[letter]) {
        countLetters[letter] = 0;
      }
      countLetters[letter]++;
    });
    assert.deepEqual(
      resultObj,
      countLetters,
      `Exam #6 ERROR, tested word: ${assignedWord}.`
    );
  });

  it("Exam #7 - Validate factorial calculation", async function() {
    await driver.get(`${url}seventh`);
    await driver.wait(until.elementLocated(By.tagName("table")), 10000);

    const elements = await driver.findElements(By.tagName("td"));
    const values = await getValues(elements);
    const webResult = Number(values[1]);
    const number = Number(values[0]);
    let calculatedResult = number;
    for (let i = calculatedResult - 1; i > 1; i--) {
      calculatedResult *= i;
    }
    assert.equal(
      calculatedResult,
      webResult,
      `Exam #7 ERROR: Calculate factorial for number: ${number}. Result on the web: ${webResult}, calculated factorial: ${calculatedResult};`
    );
  });

  it("Exam #8 - Validate result of fixed number of operands (in this case 5) and subtraction as operation", async function() {
    await driver.get(`${url}eighth`);

    const valuesDiv = await driver.findElements(By.css(divParent + "div"));
    const values = await getValues(valuesDiv);
    console.log(values);
    const result = Number(values.pop());
    const calculatedResult = values
      .map(v => Number(v))
      .reduce((total, value) => total - value);

    assert.equal(
      result,
      calculatedResult,
      `Exam #8 ERROR: Numbers to substract: ${values}, calculated result is: ${calculatedResult}, Web result is: ${result};`
    );
  });

  it("Exam #9 - Validate result of fixed number of operands (in this case 3) and addition as operation", async function() {
    await driver.get(`${url}ninth`);

    const elementsVal = await driver.findElements(
      By.css(divParent + divChildValues)
    );
    const numbers = await getValues(elementsVal);
    const sum = numbers.reduce((total, num) => total + Number(num), 0);
    const resultDiv = await driver.findElement(
      By.css(divParent + divChildResult)
    );
    const resultImgEl = await resultDiv.findElements(By.tagName("img"));
    const promisesImgsrc = resultImgEl.map(el => el.getAttribute("src"));
    const imgSrc = await Promise.all(promisesImgsrc);
    const endOfUrlPattern = /(\d)\.png$/;
    let nums = imgSrc.map(url => {
      let num = url.match(endOfUrlPattern);
      num = num[1];
      return num;
    });
    const result = Number(nums.join(""));
    assert.equal(
      result,
      sum,
      `Exam #9 ERROR!:  Actual result: ${sum}, Expected (web): ${result}, images: ${nums}`
    );
  });
  after(() => driver && driver.quit());
});
