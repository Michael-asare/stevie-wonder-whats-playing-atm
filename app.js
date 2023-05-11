const express = require("express");
const AWS = require("aws-sdk");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const app = express();
const port = process.env.PORT || 3001;
const client = new LambdaClient({
  region: 'us-east-1'
})
const command = new InvokeCommand({
  FunctionName: 'steviewonder-get-currently-playing',
  InvocationType: 'RequestResponse',
  Payload: 'String'
})

// app.get("/", (req, res) => res.type('html').send(html));
app.get("/", async (req, res) => {
  try {
    const response = await client.send(command)
    if (response.FunctionError) {
      res.status(400).json(response.FunctionError)
    } else {
      res.status(response.StatusCode).json(response.Payload)
    }
  } catch (error) {
    res.status(400).json(error)
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));