const express = require("express");
const app = express();
const cors = require("cors");
const { AISAC } = require("./api/gemini.js");
const aisac = new AISAC();

require('dotenv').config();

app.use(express.json());
app.use(cors({
    origin: ['https://aisac.acteam.dev', 'https://apiaisac.acteam.dev']
}));

aisac.LoadFiles();

app.get('/', async(req, res) => {
    console.log({ message: "AISAC Initialized" })
    res.json({ message: "AISAC Initialized" });
})

app.post('/api/aisac/', async(req, res) => {

    //res.json({user: req.session.user, prompts: req.session.prompts, message: "200 OK"});
    const prompt = req.body.prompt;

    aisac.Run(prompt).then((result) => {
            /* console.log({message:"ANSWERR", details: result.response.candidates.content}); */
            res.json({ message: result.response.text() });
        })
        .catch((error) => {
            console.error(error);
            res.json({ error: error });
        });
});

app.get('/api/aisac/', async(req, res) => {
    res.send({ message: "LIVE" });
    console.log({ message: "TEST" })
})

app.listen(process.env.PORT || 4040);

module.exports = app;