require("chromedriver");
const assert = require("assert");
const { Builder, By, until } = require("selenium-webdriver");

const url = "https://itk-qa-exams.itekako.com/";
const divParent = "div[class='main flex-center'] ";
const divChildValuesQ = "div[class='\"value\"']";
const divChildValues = "div[class='value']";
const divChildResultQ = "div[class='\"result\"']";
const divChildResult = "div[class='result']";

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
        const promises = elements.map(el => el.getText());
        const numbers = await Promise.all(promises);
        const testResult = numbers.reduce(
            (total, num) => total + Number(num),
            0
        ); // the total has to be initilazed. If not, the first time in iteration, it is a string
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
        const promisesSpans = spans.map(el => el.getText());
        const operation = await Promise.all(promisesSpans);
        operation.unshift("0");
        const elements = await driver.findElements(
            By.css(divParent + divChildValuesQ)
        );
        const promisesEl = elements.map(el => el.getText());
        const numbers = await Promise.all(promisesEl);
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
        const promises = elements.map(el => el.getText());
        const numbers = await Promise.all(promises);
        const testResult = numbers.reduce(
            (total, num) => total * Number(num),
            1
        ); // the total has to be initilazed. If not, the first time in iteration, it is a string
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
        await driver.get("https://itk-qa-exams.itekako.com/fourth");

        const spans = await driver.findElements(By.css(divParent + "span"));
        const promisesSpans = spans.map(el => el.getText());
        const operation = await Promise.all(promisesSpans);
        operation.unshift("0");
        const elements = await driver.findElements(
            By.css(divParent + divChildValuesQ)
        );
        const promisesEl = elements.map(el => el.getText());
        const numbers = await Promise.all(promisesEl);
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

        const resultsEl = await driver.findElements(By.tagName("td"));
        const promisesRes = resultsEl.map(el => el.getText());
        let resultsAll = await Promise.all(promisesRes);
        let resultsPage = resultsAll
            .filter((res, index) => {
                return (index + 1) % 2 === 0;
            })
            .join("");
        const wordEl = await driver.findElement(By.id("word")).getText();
        let word = await Promise.resolve(wordEl);
        word = word.split("");
        const myResultObj = word.reduce((total, letter) => {
            if (total[letter]) {
                total[letter]++;
            } else {
                total[letter] = 1;
            }
            return total;
        }, {});
        let myResults = Object.keys(myResultObj)
            .map(key => myResultObj[key])
            .join("");
        assert(resultsPage === myResults, "Exam #6 ERROR!");
    });

    it("Exam #7 - Validate factorial calculation", async function() {
        await driver.get(`${url}seventh`);
        await driver.wait(until.elementLocated(By.tagName("table")), 10000);

        const elements = await driver.findElements(By.tagName("td"));
        const promises = elements.map(el => el.getText());
        const values = await Promise.all(promises);
        const result = Number(values[1]);
        let myResult = Number(values[0]);
        for (let i = myResult - 1; i > 1; i--) {
            myResult *= i;
        }
        assert(myResult === result, "Exam #7 ERROR!");
    });

    it("Exam #8 - Validate result of fixed number of operands (in this case 5) and subtraction as operation", async function() {
        await driver.get(`${url}eighth`);

        const valuesDiv = await driver.findElements(By.css(divParent + "div"));
        const valuesPromise = valuesDiv.map(div => div.getText());
        const values = await Promise.all(valuesPromise);

        const result = Number(values.pop());
        const myResult = values.reduce((total, val, i) => {
            if (i === 0) {
                total += val;
                return total;
            } else {
                total -= val;
                return total;
            }
        }, 0);
        assert(result === myResult, "Exam #8 ERROR!");
    });

    it("Exam #9 - Validate result of fixed number of operands (in this case 3) and addition as operation", async function() {
        await driver.get(`${url}ninth`);

        const elementsVal = await driver.findElements(
            By.css(divParent + divChildValues)
        );
        const promises = elementsVal.map(el => el.getText());
        const numbers = await Promise.all(promises);
        const sum = numbers.reduce((total, num) => (total += Number(num)), 0);
        const resultDiv = await driver.findElement(
            By.css(divParent + divChildResult)
        );
        const resultImgEl = await resultDiv.findElements(By.tagName("img"));
        const promisesImgsrc = resultImgEl.map(el => el.getAttribute("src"));
        const imgSrc = await Promise.all(promisesImgsrc);
        let result = imgSrc
            .map(src => {
                return src.charAt(src.length - 5);
            })
            .join("");
        result = Number(result);
        assert(result == sum, "Exam #9 ERROR!");
    });
    after(() => driver && driver.quit());
});
