import express from "express";
import { spawn } from "child_process";

const app: express.Application = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const cmd: Array<string> = (process.env.CMD || "").split(" ");
const sendLog: boolean = process.env.SEND_LOG === "true";
const branches = process.env.TARGET_BRANCH
  ? process.env.TARGET_BRANCH.split(",")
  : [];

function hasTargetBranch(ref: string): boolean {
  if (branches.length) {
    for (let i = 0; i < branches.length; i++) {
      if (ref.indexOf(branches[i]) > -1) {
        return true;
      }
    }
    return false;
  } else {
    return true;
  }
}

function getLogDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
}

app.use(express.json());
app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.post("/", (req: express.Request, res: express.Response) => {
  let targetRef: string
  if (!req.body) {
    // 没有请求体，记录错误日志并返回 400 状态码
    console.error(getLogDate(), "No request body");
    return res.sendStatus(400);
  } else {
    // 从请求体中提取目标分支信息
    targetRef = req.body.ref.slice(11) || "";
  }
  let resp: string;
  if (hasTargetBranch(targetRef)) {
    // 目标分支的 webhook 请求，执行命令并记录日志
    console.log(getLogDate(), "Received webhook for branch: " + targetRef);
    resp = '\nReceived webhook for branch: ' + targetRef + '\n';
    if (cmd.length) {
      console.log(getLogDate(), "---- Execute command start ----");
      if (sendLog) {
        resp += '\n---- Execute command start ----\n';
      }
      const child = spawn(cmd[0], cmd.slice(1));
      child.stdout.on("data", (buffer) => {
        const log = buffer.toString();
        console.log(getLogDate(), log);
        if (sendLog) {
          resp += log;
        }
      });
      child.stdout.on("end", () => {
        console.log(getLogDate(), "---- Execute command end ----");
        if (sendLog) {
          resp += "\n---- Execute command end ----\n";
          res.send(resp);
        }
      });
      if (sendLog) {
        return;
      }
    } else {
      // 没有指定命令，记录警告日志并返回提示信息
      console.warn(getLogDate(), "No command specified");
      if (sendLog) {
        resp += "No command specified";
      }
    }
  } else {
    // 非目标分支的 webhook 请求，记录日志但不执行命令
    console.log(getLogDate(), "Received webhook for non-target branch: " + targetRef);
    resp = '\nReceived webhook for non-target branch: ' + targetRef + '\n';
  }
  res.send(resp);
});

app.listen(port, () => {
  console.log(getLogDate(), `listening on port ${port}`);
});
