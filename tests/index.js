/* global describe, it */

var fs = require('fs');
var path = require('path');
var assert = require('chai').assert;
var postcss = require('postcss');
var csslt = require('../lib/index.es6.js');

const FIXTURES = path.resolve(__dirname, 'fixtures');
const INPUT_REG = /^(.*).in.css$/;

function readFile(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, function (err, data) {
            if (err) {
                return reject(err);
            }

            resolve(data.toString());
        });
    });
}

function getPostcssResult(file, opts) {
    return readFile(file)
        .then(function (filecontent) {
            return postcss([ csslt(opts) ])
                .process(filecontent);
        });
}

function testFiles(directory, testName, opts) {
    const inputFile = path.resolve(directory, testName + '.in.css');
    const outputFile = path.resolve(directory, testName + '.out.css');

    return Promise.all([ getPostcssResult(inputFile, opts), readFile(outputFile) ])
        .then(function (arr) {
            const result = arr[0];
            const output = arr[1];

            assert.strictEqual(result.warnings().length, 0);
            assert.strictEqual(result.css, output);
        });
}

function testDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(function (file) {
        const matches = INPUT_REG.exec(file);

        if (matches) {
            it(matches[1], function (done) {
                return testFiles(dir, matches[1])
                    .then(done, done);
            });
        }
    });
}

describe('CSSLT', function () {
    const files = fs.readdirSync(FIXTURES);

    files.forEach(function (file) {
        const filepath = path.resolve(FIXTURES, file);

        if (fs.statSync(filepath).isDirectory()) {
            describe(file, function () {
                testDirectory(filepath);
            });
        }
    });
});
