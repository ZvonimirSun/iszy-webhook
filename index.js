const express = require("express");
const spawn = require("child_process").spawn;

const app = express();
const port = process.env.PORT || 3000;
const cmd = (process.env.CMD || "").split(" ");

app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/", (req, res) => {
    if (cmd.length) {
        const child = spawn(cmd[0], cmd.slice(1));
        let resp = "";
        child.stdout.on("data", (buffer) => {
            resp += buffer.toString();
        });
        child.stdout.on("end", () => {
            console.log(resp);
            res.send(resp);
        });
    } else {
        console.log("No command specified");
        res.send("No command specified");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
