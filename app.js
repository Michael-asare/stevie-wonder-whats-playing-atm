const express = require("express");
const AWS = require("aws-sdk")
const app = express();
const port = process.env.PORT || 3001;
const lambda = new AWS.Lambda({region: 'us-east-1'})

// app.get("/", (req, res) => res.type('html').send(html));
app.get("/", async (req, res) => {
  lambda.invoke((error, data) => {
    if (error != null || error != undefined) {
      res.status(400).json(error)
    } else {
      res.status(200).json(data)
    }
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));