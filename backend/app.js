const express = require ("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const { dameQueso } = require("./config/config");
const { AISAC } = require("./api/gemini.js");
const aisac = new AISAC();

app.use(express.json());
app.use(cors());
app.use(session({
    secret: dameQueso(),
    resave: true,
    saveUninitialized: true
}));

aisac.LoadFiles();

app.get('/', async (req, res) => {
    aisac.LoadFiles();
    res.json({message:"AISAC Initialized"});
})

app.post('/api/aisac/', async (req, res) => {

    res.json({user: req.session.user, prompts: req.session.prompts, message: "200 OK"});
    aisac.Run(req.query.prompt).then((result) => {
        req.session.prompts = req.session.prompts ? ++req.session.prompts : 1;
        res.json({message:result.response.text(), prompts: req.session.prompts});
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' , chatSession: aisac.chatSession});
    });
});

app.post('/api/add-user/', async (req, res) => { 
    req.session.user = req.body.user;
    req.session.prompts = 0
    res.json({user: req.body.user, message: "200 OK"});
});

app.listen(3000);