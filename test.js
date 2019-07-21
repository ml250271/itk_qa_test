require("chromedriver");
const assert = require("assert");
const { Builder, Key, By, until } = require("selenium-webdriver");

describe("Tests", function() {
    let driver;
    before(async function() {
        driver = await new Builder().forBrowser("chrome").build();
    });

    it("Exam #1", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/first");

        const elements = await driver.findElements(By.className('"value"'));
        const promises = elements.map(el => el.getText());
        const numbers = await Promise.all(promises);
        const sum = numbers.reduce((total, num) => (total += Number(num)), 0);
        let result = await driver
            .findElement(By.className('"result"'))
            .getText();
        result = Number(result);
        //console.log("********", result, sum);

        assert(result === sum, "Exam #1 ERROR!");
    });

    it("Exam #2", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/second");

        const spans = await driver.findElements(By.tagName("span"));
        const promisesSpans = spans.map(el => el.getText());
        const operation = await Promise.all(promisesSpans);
        operation.unshift("0");
        //console.log(operation);
        const elements = await driver.findElements(By.className('"value"'));
        const promisesEl = elements.map(el => el.getText());
        const numbers = await Promise.all(promisesEl);
        //console.log(numbers);
        let result = await driver
            .findElement(By.className('"result"'))
            .getText();
        result = Number(result);
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
        console.log("sum whole", total);
        if (total % 1 !== 0) {
            total = Math.round(total * 100) / 100;
        }
        console.log("sum", total);

        assert(result === total, "Exam #2 ERROR!");
    });

    it("Exam #3", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/third");

        const elements = await driver.findElements(By.className('"value"'));
        const promises = elements.map(el => el.getText());
        const numbers = await Promise.all(promises);
        const sum = numbers.reduce((total, num) => (total *= Number(num)), 1);
        let result = await driver
            .findElement(By.className('"result"'))
            .getText();
        result = Number(result);
        //console.log("********", result, sum);
        assert(result === sum, "Exam #3 ERROR!");
    });

    it("Exam #4", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/fourth");

        const spans = await driver.findElements(By.tagName("span"));
        const promisesSpans = spans.map(el => el.getText());
        const operation = await Promise.all(promisesSpans);
        operation.unshift("0");
        //console.log(operation);
        const elements = await driver.findElements(By.className('"value"'));
        const promisesEl = elements.map(el => el.getText());
        const numbers = await Promise.all(promisesEl);
        let result = await driver
            .findElement(By.className('"result"'))
            .getText();
        result = Number(result);
        let total = Number(numbers[0]);

        for (i = 1; i < numbers.length; i++) {
            if (operation[i] == "*") {
                total *= Number(numbers[i]);
            } else if (operation[i] == "/") {
                total /= Number(numbers[i]);
            }
        }

        console.log("sum whole", total);
        if (total % 1 !== 0) {
            total = Math.round(total * 100) / 100;
        }
        console.log("sum", total);

        assert(result === total, "Exam #4 ERROR!");
    });

    it("Exam #5", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/fifth");

        const wordEl = await driver.findElement(By.id("word"));
        const word = await wordEl.getText();
        const resultEl = await driver.findElement(By.id("result"));
        const result = await resultEl.getText();
        //console.log("PALINDROME:", word, result);
        const wordArr = word.toLowerCase().split("");
        //console.log("wordArr:", wordArr); //  a m n m a \ a m m a | anavoli m ilovana

        const numForSlice = (wordArr.length / 2) | 0;
        //console.log(numForSlice);
        let myResult = "Yes";

        for (let i = 0; i < numForSlice; i++) {
            if (wordArr[i] !== wordArr[wordArr.length - 1 - i]) {
                myResult = "No";
            }
        }

        assert(result === myResult, "Exam #5 ERROR!");
    });

    it("Exam #6", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/sixth");

        const resultsEl = await driver.findElements(By.tagName("td"));
        const promisesRes = resultsEl.map(el => el.getText());
        let resultsAll = await Promise.all(promisesRes);
        //console.log(resultsAll);
        let resultsPage = resultsAll
            .filter((res, index) => {
                return (index + 1) % 2 === 0;
            })
            .join("");
        // console.log(resultsPage);
        //the word
        const wordEl = await driver.findElement(By.id("word")).getText();
        let word = await Promise.resolve(wordEl);
        word = word.split("");
        //console.log(word);
        // word = m,i,l,i,c,a [[m, 1]]

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

        //console.log(myResultObj);
        assert(resultsPage === myResults, "Exam #6 ERROR!");
    });

    it("Exam #7", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/seventh");
        driver
            .wait(function() {
                return driver
                    .findElements(By.tagName("td"))
                    .then(function(tds) {
                        if (tds.length > 0) {
                            return tds;
                        }
                    });
            }, 30000)
            .then(async elements => {
                const promises = elements.map(el => el.getText());
                const values = await Promise.all(promises);
                const result = Number(values[1]);
                let myResult = Number(values[0]);
                for (let i = myResult - 1; i > 1; i--) {
                    myResult *= i;
                }
                console.log("myRes", myResult);
                assert(myResult === result, "Exam #7 ERROR!");
            });
    });

    it("Exam #8", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/eighth");

        const parent = await driver.findElement(
            By.className("main flex-center")
        );
        const valueDiv = await parent.findElements(By.tagName("div"));
        const valuesProm = valueDiv.map(div => div.getText());
        const values = await Promise.all(valuesProm);

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
        //console.log(myResult);
        assert(result === myResult, "Exam #8 ERROR!");
    });

    it("Exam #9", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/ninth");

        const elementsVal = await driver.findElements(By.className("value"));
        const promises = elementsVal.map(el => el.getText());
        const numbers = await Promise.all(promises);
        const sum = numbers.reduce((total, num) => (total += Number(num)), 0);
        // get result:
        const resultDiv = await driver.findElement(By.className("result"));
        const resultImgEl = await resultDiv.findElements(By.tagName("img"));
        //console.log(resultImgEl);
        const promisesImgsrc = resultImgEl.map(el => el.getAttribute("src"));
        const imgSrc = await Promise.all(promisesImgsrc);
        //console.log(imgSrc);
        let result = imgSrc
            .map(src => {
                return src.charAt(src.length - 5);
            })
            .join("");
        result = Number(result);
        //console.log(result);

        assert(result == sum, "Exam #9 ERROR!");
    });
    after(() => driver && driver.quit());
});
