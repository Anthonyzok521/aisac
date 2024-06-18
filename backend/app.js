const express = require ("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { dameQueso } = require("./config/config");
const { AISAC } = require("./api/gemini.js");
const aisac = new AISAC();

require('dotenv').config();

app.use(express.json());
app.use(cors());

aisac.LoadFiles();

app.get('/', async (req, res) => {
    aisac.LoadFiles();
    console.log({message:"AISAC Initialized"})
    res.json({message:"AISAC Initialized"});
})

app.post('/api/aisac/', async (req, res) => {

   //res.json({user: req.session.user, prompts: req.session.prompts, message: "200 OK"});
    const prompt = req.body.prompt;    

    aisac.Run(prompt).then((result) => {
        res.json({message:result.response.text()});
        console.log({message:"ANSWERR"})
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' , chatSession: aisac.chatSession});
    });
});

app.get('/api/aisac/', async (req, res) => {
    res.json({message:"LIVE"});
    console.log({message:"TEST"})
})

app.listen(process.env.PORT || 3000);