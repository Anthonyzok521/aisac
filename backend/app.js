const express = require ("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { dameQueso } = require("./config/config");
const { AISAC } = require("./api/gemini.js");
const aisac = new AISAC();

app.use(express.json());
app.use(cors());

aisac.LoadFiles();

app.get('/', async (req, res) => {
    aisac.LoadFiles();
    res.json({message:"AISAC Initialized"});
})

app.post('/api/aisac/', async (req, res) => {

   //res.json({user: req.session.user, prompts: req.session.prompts, message: "200 OK"});
    const prompt = req.body.prompt;    

    aisac.Run(prompt).then((result) => {
        res.json({message:result.response.text()});
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' , chatSession: aisac.chatSession});
    });
});


app.listen(3000);