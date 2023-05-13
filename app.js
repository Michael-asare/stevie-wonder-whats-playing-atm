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
  console.log("Got in a request for /current/colors")
  console.log(req)
  let numClusters = req.query.numClusters;
  try {
    const queryParams = numClusters == undefined ? "" : `?numClusters=${numClusters}`
    console.log(`Attempting to ping ${colorsEndpoint+queryParams}`)
    const response = await fetch(colorsEndpoint+queryParams, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}
    })
    const jsonResponse = await response.json()
    console.log(`Ping successful! Here is the response in json form: ${JSON.stringify(jsonResponse)}`)
    if (response.ok) {
      res.status(200).json(jsonResponse.Payload)
    } else {
      console.log("Error arrived during song cover -> colors process")
      res.status(400).json(jsonResponse)
    }
  } catch (error) {
    console.log("Error arrived early")
    res.status(400).json(error)
  }
});
app.listen(port, () => console.log(`Stevie Wonder app listening on port ${port}!`));