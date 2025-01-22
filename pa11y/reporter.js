// ./my-reporter.js

const fs = require("fs");
const path = require("path");

const appReportsPath = '../app/src/reports/';

module.exports = function (options) {
	console.log('STARTING REPORTER');
	
    // initialize an empty report data
    const customReport = {
        results: {},
        errors: [],
        violations: 0,
    };

    const fileName = options.fileName;

    return {
        // add results to the report
        results(results) {
            customReport.results[results.pageUrl] = results;
            customReport.violations += results.issues.length;
        },

        // add errors too
        error(error, url) {
            customReport.errors.push({ error, url });
        },

        // write everything to a file
        async afterAll() {
			const data = JSON.stringify(customReport);

			await fs.promises.mkdir(appReportsPath, { recursive: true });
			await fs.promises.writeFile(`${appReportsPath}${path.basename(fileName)}`, data, "utf8");

            return fs.promises.writeFile(fileName, data, "utf8");
        },
    };
};
