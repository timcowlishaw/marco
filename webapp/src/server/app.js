import path from 'path';
import process from 'process';
import express from 'express';
import bodyParser from 'body-parser';
import base64img from 'base64-img';
import uuidv4 from 'uuid/v4';
import fs from 'fs';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;

const distDir = __dirname;
const dataDir = path.join(distDir, "..", "data");
const imgDir = path.join(dataDir, "img");
const sqlDir = path.join(dataDir, "sql");
const indexHtml = path.join(distDir, "index.html");

fs.mkdirSync(imgDir, {recursive: true });
fs.mkdirSync(sqlDir, {recursive: true });

const db = new sqlite3.Database(path.join(sqlDir, "marco.sqlite"), (err) => {
    if(err) {
        console.log("Count not connect to database:", err);
    } else {
        console.log("Connected to database.");
        db.run(`
CREATE TABLE IF NOT EXISTS pictures (
    id TEXT PRIMARY KEY,
    screen TEXT,
    timestamp INTEGER
)
`, [], (err2) => {
            if(err2) {
                console.log("Error initializing schema:", err2);
            } else {
                console.log("Schema initialized.");
            }
        });
    }
});

app.use("/img",  express.static(imgDir));
app.use(express.static(distDir));
app.use(bodyParser());

app.get("/", (req, res) => {
    res.sendFile(indexHtml);
});

app.post("/send/:screenId", (req, res) => {
    const screenId = req.params["screenId"].toLowerCase();
    const body = req.body;
    const id = uuidv4();
    const timestamp = Math.floor(Date.now() / 1000);
    const image = base64img.img(body["data"], imgDir, id, (err, filePath) => {
        db.run(
            `INSERT INTO pictures (id, screen, timestamp) VALUES (?, ?, ?)`,
            [id, screenId, timestamp],
            (err) => {
                if(err) {
                    next(err);
                } else {
                    res.send(id);
                }
            });
    });
});


app.get("/receive/:screenId", (req, res) => {
    const screenId = req.params["screenId"];
    const maxTime = Math.floor(Date.now() / 1000);
    db.get(`
      SELECT id FROM pictures
      WHERE screen = ? AND timestamp <= ?
      ORDER BY timestamp DESC
      LIMIT 1`, [screenId, maxTime], (err, result) => {
          if(err) {
              next(err);
          } else {
              if(result) {
                  const id = result["id"];
                  res.redirect(`/img/${id}.png`);
              } else {
                  res.status(404).send("Not found");
              }
          }
    });
});

app.listen(port, () => console.log(`Marco app listening on port  ${port}`));

process.on('exit', () => {
    db.close();
});
