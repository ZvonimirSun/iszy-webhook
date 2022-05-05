"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const app = (0, express_1.default)();
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const cmd = (process.env.CMD || "").split(" ");
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/", (req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }
    else {
        req.body.ref = req.body.ref || "";
    }
    let hasTarget = false;
    if (process.env.TARGET_BRANCH) {
        const branches = process.env.TARGET_BRANCH.split(",");
        for (let i = 0; i < branches.length; i++) {
            if (req.body.ref.slice(11).indexOf(branches[i]) > -1) {
                hasTarget = true;
                break;
            }
        }
    }
    else {
        hasTarget = true;
    }
    if (hasTarget) {
        if (cmd.length) {
            const child = (0, child_process_1.spawn)(cmd[0], cmd.slice(1));
            let resp = "\nTarget branch: " + req.body.ref.slice(11) + "\n";
            child.stdout.on("data", (buffer) => {
                resp += buffer.toString();
            });
            child.stdout.on("end", () => {
                console.log(resp);
                res.send(resp);
            });
        }
        else {
            console.log("No command specified");
            res.send("No command specified");
        }
    }
    else {
        res.send("Nothing to do");
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map