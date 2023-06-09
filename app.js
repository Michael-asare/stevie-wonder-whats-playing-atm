const express = require("express");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const app = express();
const port = process.env.PORT || 3001;
const lambdaClient = new LambdaClient({
  region: 'us-east-1'
})
const command = new InvokeCommand({
  FunctionName: 'steviewonder-get-currently-playing',
  InvocationType: 'RequestResponse',
  Payload: JSON.stringify('') // here holds the json key value pairing for the request (nothing is needed atm)
})



app.get("/current", async (req, res) => {
  try {
    const response = await lambdaClient.send(command)
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

const { GoogleAuth } = require('google-auth-library')
const googleAuth = new GoogleAuth()
const gaxois = require('gaxios')


app.get("/current/colors", async (req, res) => {
  console.log("Got in a request for /current/colors")
  console.log(req)
  let numClusters = req.query.numClusters;
  try {
    console.log("Attempting to create an authenticated google request client...")
    const googleAuthClient = await googleAuth.getIdTokenClient(colorsEndpoint)
    console.log("...done")
    const queryParams = numClusters == undefined ? "" : `?numClusters=${numClusters}`
    console.log(`Attempting to ping ${colorsEndpoint + queryParams}`)
    const response =  await googleAuthClient.request({
      "url": colorsEndpoint + queryParams,
      "method": "POST",
      "fetchImplementation": fetch,
      "headers": {
        "Content-Type": "application/json"
      }
    })
    // const response = await fetch(colorsEndpoint + queryParams, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // })
    // const jsonResponse = await response.json()
    const responseData = response.data
    console.log(`Ping successful! Here is the response in json form: ${JSON.stringify(responseData, null, 4)}`)
    if (response.statusText === 'OK') {
      res.status(200).json(responseData)
    } else {
      console.log("Error arrived during song cover -> colors process")
      console.log(response)
      res.status(400).json({error: "Error arrived during song cover -> colors process"})
    }
  } catch (error) {
    console.log("Error arrived early")
    console.log(error)
    if (error instanceof gaxois.GaxiosError) {
      console.log("A Gaxios error occured")
      if (error.response.data.error !== undefined) {
        console.log("Found an error message!")
        res.status(400).json({error: error.response.data.error})
      } else {
        console.log("Was not able to handle this gaxios error. Falling back to default handling.")
      }
    }
    res.status(500).json({error: "A Server Error Has Occured. If you are a maintainer, please look at the server logs for more information."})
  }
});
app.listen(port, () => console.log(`Stevie Wonder app listening on port ${port}!`));