const express = require("express");
const bodyParser = require("body-parser");
const Epub = require("epub-gen");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/generate-epub", async (req, res) => {
  const { title, author, content } = req.body;

  const options = {
    title: title,
    author: author,
    content: content.map((chapter, index) => ({
      title: `Chapter ${index + 1}`,
      data: chapter,
    })),
    output: path.join(__dirname, `${title}.epub`),
  };

  try {
    await new Epub(options).promise;
    res.download(
      path.join(__dirname, `${title}.epub`),
      `${title}.epub`,
      (err) => {
        if (err) {
          console.error(err);
        }
        fs.unlinkSync(path.join(__dirname, `${title}.epub`)); // Delete the file after sending it
      }
    );
  } catch (error) {
    res.status(500).send("Error generating EPUB");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
