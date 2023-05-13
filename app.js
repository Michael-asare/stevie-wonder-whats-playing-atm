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
  Payload: JSON.stringify('') // here holds the json key value pairing for the request (nothing is needed atm)
})

app.get("/current", async (req, res) => {
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

const colorsEndpoint = "https://us-east4-stevie-wonder-386422.cloudfunctions.net/song-colors"
app.get("/current/colors", async (req, res) => {
  let numClusters = req.query.numClusters;
  try {
    const queryParams = numClusters == undefined ? "" : `numClusters=${numClusters}`
    const response = await fetch(colorsEndpoint+queryParams, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}
    })
    console.log(response)
    if (response.ok) {
      res.status(200).json(response.body)
    } else {
      console.log("Error arrived during song cover -> colors process")
      res.status(400).json(response.body)
    }
  } catch (error) {
    console.log("Error arrived early")
    res.status(400).json(error)
  }
});
app.listen(port, () => console.log(`Stevie Wonder app listening on port ${port}!`));