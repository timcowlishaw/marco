import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import base64img from 'base64-img';
import uuidv4 from 'uuid/v4';
import fs from 'fs';

const app = express();
const port = 3000;
const distDir = __dirname;
const dataDir = path.join(distDir, "..", "data");
const imgDir = path.join(dataDir, "img");
const indexHtml = path.join(distDir, "index.html");
fs.mkdirSync(imgDir, {recursive: true });
app.use(express.static(distDir));
app.use(bodyParser());

app.get("/", (req, res) => {
    res.sendFile(indexHtml);
});

app.post("/send/:screenId", (req, res) => {
    const screenId = req.params["screenId"];
    const body = req.body;
    const id = uuidv4();
    const image = base64img.img(body["data"], imgDir, id, (err, filePath) => {
        res.send(filePath);
    });
});

app.listen(port, () => console.log(`Marco app listening on port  ${port}`));
