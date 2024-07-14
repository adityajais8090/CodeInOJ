const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

// Run endpoint for compiling and executing code
app.post("/run", async (req, res) => {
    const { language = 'cpp', code, input } = req.body;
    if (!code) {
        return res.status(400).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = generateFile(language, code);
        const inputPath = generateInputFile(input);
        const output = await executeCpp(filePath, inputPath, 10000, 5000000); // Example timeLimit and memoryLimit
        res.json({ filePath, output, inputPath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit endpoint for testing code against multiple test cases
app.post("/submit", async (req, res) => {
    const { language = 'cpp', code, testcases, timelimit, memorylimit } = req.body;
    if (!code || !testcases || testcases.length === 0 || !timelimit || !memorylimit) {
        return res.status(400).json({ success: false, error: "Empty code or test cases!" });
    }
    try {
        const filePath = generateFile(language, code);
        const results = [];

        for (let i = 0; i < testcases.length; i++) {
            const input = testcases[i].input;
            const expectedOutput = testcases[i].output;
            const inputPath = generateInputFile(input);
            try {
                const output = await executeCpp(filePath, inputPath, timelimit, memorylimit);
                const testcaseResult = {
                    input,
                    expectedOutput,
                    yourOutput: output,
                    success: output.trim() === expectedOutput.trim(),
                };
                console.log("Output :", output.trim(), " CorrectOutput :", expectedOutput.trim());
                results.push(testcaseResult);

                if (!testcaseResult.success) {
                    break;
                }
            } catch (error) {
                const testcaseResult = {
                    input,
                    expectedOutput,
                    yourOutput: error.message,
                    success: false
                };
                results.push(testcaseResult);
                break;
            }
        }

        const passedAll = results.every(result => result.success);

        if (passedAll) {
            res.status(200).json({
                message: "Code Passed All Test Cases",
                status: "passed",
                count: results.length,
                results
            });
        } else {
            const failedTestcase = results.find(result => !result.success);
            res.status(200).json({
                message: `Code Failed at Test Case ${results.indexOf(failedTestcase) + 1}`,
                status: "failed",
                failedTestcase,
                count: results.filter(result => result.success).length,
                results
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
