const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const LAMBDA_URL = process.env.LAMBDA_URL

// app.get("/", (req, res) => res.type('html').send(html));
app.get("/", async (req, res) => {
  try {
    let response = await fetch(LAMBDA_URL, {
      method: 'GET'
    })
    let jsonResponse = await response.json()
    res.status(200).json(response)
  } catch (error) {
    res.status(400).json(error)
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));