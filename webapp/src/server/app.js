import path from 'path';
import express from 'express';
const app = express();
const port = 3000;
const distDir = __dirname;
const indexHtml = path.join(distDir, "index.html");
app.use(express.static(distDir));
app.get("/", (req, res) => {
    res.sendFile(indexHtml);
});

app.listen(port, () => console.log(`Marco app listening on port  ${port}`));
