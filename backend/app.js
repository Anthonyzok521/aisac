const expres = require ("express");
const app = expres();
const cors = require("cors");
const {access} = require("./middleware/access.js");

app.use(cors());

app.use(access);

const { AISAC } = require("./api/gemini.js");

const aisac = new AISAC();

aisac.LoadFiles();

app.get("/", async (req, res) => {
    aisac.LoadFiles();
    res.send("AISAC Initialized");
})

app.post("/api/aisac/", async (req, res) => {
    res.json({message: "200 OK"});
    /* aisac.Run(req.query.prompt).then((result) => {
        console.log(result.response.text());
        res.json({message:result.response.text()});
    })
    .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' , chatSession: aisac.chatSession});
    }); */
});

app.listen(3000);