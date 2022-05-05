# ISZY Webhook

自用 Webhook 程序，在 Github 发送 Webhook 后，在服务器上自动执行指定程序并返回输出内容。

## 环境变量

- `CMD`: 执行的程序命令，如未指定则不会执行任何内容
- `PORT`: 程序监听的 http 端口，默认为 3000
- `TARGET_BRANCH`: 需要运行的分支，如未指定则任意分支均会运行

## 本地启动

### 安装依赖

```bash
yarn
```

### 运行

```bash
yarn start
```

## Docker 启动

```bash
docker run -it -p 3000:3000 --name iszy-webhook -v $(pwd):/data -w /data -e CMD="sh test.sh" -e TARGET=main ghcr.io/zvonimirsun/iszy-webhook
```

如需要使用 git 命令，请使用 `ghcr.io/zvonimirsun/iszy-webhook:git`，已安装好 git 程序。
