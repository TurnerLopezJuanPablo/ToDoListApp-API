import express from 'express'
import connection from "./connection/connection.js";
import { serverPort, corsOrigin } from "./config/config.js"

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Error Handler
app.use((error, req, res, next) => {
  const additionalData = error.additionalData || {};

  const responseData = {
    success: false,
    message: error.message,
    ...additionalData,
  };

  res
    .status(error.status || 500)
    .send(responseData);
});

let force = true
const port = parseInt(serverPort) || 8080;

connection.sync({ force })
  .then(() => {
    app.listen(port, () => {
      //console.clear()
      console.log("server OK http://localhost:" + port);
    })
  });