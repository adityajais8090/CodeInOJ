const express = require('express');
const app = express();
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const cors  = require('cors');

//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ online: 'compiler' });
});

app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = generateFile(language, code);
        const inputPath = generateInputFile(input);
        console.log("Here is my input : ", input);
        const output = await executeCpp(filePath, inputPath);
        res.json({ filePath, output, inputPath });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.listen(5000, () => {
    console.log("Server is listening on port 5000!");
});