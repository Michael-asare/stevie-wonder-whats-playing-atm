const express = require("express");
const AWS = require("aws-sdk");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const app = express();
const port = process.env.PORT || 3001;
process.env.AWS_ACCESS_KEY_ID = "AKIASRKSLMKBPIBZCVX2"
process.env.AWS_SECRET_ACCESS_KEY = "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"
const client = new LambdaClient({
  region: 'us-east-1'
})
const command = new InvokeCommand({
  FunctionName: 'steviewonder-get-currently-playing',
  InvocationType: 'RequestResponse',
  Payload: JSON.stringify('') // here holds the json key value pairing for the request (nothing is needed atm)
})

app.get("/", async (req, res) => {
  try {
    const response = await client.send(command)
    console.log(response)
    if (response.FunctionError) {
      res.status(400).json(response.FunctionError)
    } else {
      const result = Buffer.from(response.Payload).toString()
      const jsonResult = JSON.parse(result)
      res.status(response.StatusCode).json(jsonResult)
    }
  } catch (error) {
    res.status(400).json(error)
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));