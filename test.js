require("chromedriver");
const assert = require("assert");
const { Builder, Key, By, until } = require("selenium-webdriver");

describe("Checkout kp.net", function() {
    let driver;
    before(async function() {
        driver = await new Builder().forBrowser("chrome").build();
    });

    it("Exam #1", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/first");

        // Find the search box by id

        // const title = await driver

        // .findElements(By.className("oglas-title"))

        // .then(els => els.getText().then(text => console.log(text);

        // ));

        // should.have.value("ok");

        const elements = await driver.findElements(By.className('"value"'));
        const promises = elements.map(el => el.getText());
        const numbers = await Promise.all(promises).then(text => text);

        const sum = numbers.reduce((total, num) => (total += Number(num)), 0);
        const result = await driver
            .findElement(By.className('"result"'))
            .getText();

        console.log("********", result, sum);

        assert(result == sum, "brvo");
    });

    it("Exam #2", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/second");

        const spans = await driver.findElements(By.tagName("span"));

        const promises2 = spans.map(el => el.getText());
        const operands = await Promise.all(promises2).then(text => text);

        console.log(operands);

        const elements = await driver.findElements(By.className('"value"'));
        const promises = elements.map(el => el.getText());
        const numbers = await Promise.all(promises).then(text => text);
        const result = await driver
            .findElement(By.className('"result"'))
            .getText();
        let total = Number(numbers[0]);

        for (
            let i = 0, j = 1;
            i < operands.length - 1, j < numbers.length;
            i++, j++
        ) {
            if (operands[i] == "+") {
                total += Number(numbers[j]);
            } else if (operands[i] == "-") {
                total -= Number(numbers[j]);
            } else if (operands[i] == "*") {
                total *= Number(numbers[j]);
            } else if (operands[i] == "/") {
                total /= Number(numbers[j]);
            }
        }
        console.log("sum", total);

        assert(result == total, "greska");
    });

    it("Exam #3", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/third");

        const elements = await driver.findElements(By.className('"value"'));
        const promises = elements.map(el => el.getText());
        const numbers = await Promise.all(promises).then(text => text);
        const sum = numbers.reduce((total, num) => (total *= Number(num)), 1);
        const result = await driver
            .findElement(By.className('"result"'))
            .getText();

        console.log("********", result, sum);
        assert(result == sum, "brvo");
    });

    it("Exam #4", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/fourth");

        const spans = await driver.findElements(By.tagName("span"));
        const promises2 = spans.map(el => el.getText());
        const operands = await Promise.all(promises2).then(text => text);

        console.log(operands);
        const elements = await driver.findElements(By.className('"value"'));

        const promises = elements.map(el => el.getText());
        const numbers = await Promise.all(promises).then(text => text);
        const result = await driver
            .findElement(By.className('"result"'))
            .getText();

        let total = Number(numbers[0]);

        for (
            let i = 0, j = 1;
            i < operands.length - 1, j < numbers.length;
            i++, j++
        ) {
            if (operands[i] == "*") {
                total *= Number(numbers[j]);
            } else if (operands[i] == "/") {
                total /= Number(numbers[j]);
            }
        }

        console.log("sum", total);

        assert(result == total, "greska");
    });

    it("Exam #5", async function() {
        await driver.get("https://itk-qa-exams.itekako.com/fifth");

        const wordEl = await driver.findElement(By.id("word"));
        const word = await wordEl.getText();
        const resultEl = await driver.findElement(By.id("result"));
        const result = await resultEl.getText();
        console.log("PALINDROME:", word, result);

        const wordArr = word.toLowerCase().split("");
    });
});
