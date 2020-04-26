const express = require("express");
const app = express();
const port = process.env.PORT || 2222;
const axios = require("axios");
const key = require("./MuslimSalatAPIKey");
const cors = require('cors');
app.use(cors());
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/getTimings/:city", (req, res) => {
  axios({
    method: "get",
    url: `https://muslimsalat.com/${req.params.city}/yearly/24-04-2020.json?key=${key}`,
  })
    .then((response) => {
      if (response.data.status_description === "Failed.") {
        res.status(204).json({
          response: response.data,
          status: "Error in Search String",
        });
      } else {
        res.status(200).json({
          response: response.data,
          status: "Success",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(503).json({
        error,
      });
    });
});
app.get("/getTimings/Shafi/:city", (req, res) => {
  axios({
    method: "get",
    url: `https://muslimsalat.com/${req.params.city}/yearly/24-04-2020/2.json?key=${key}`,
  })
    .then((response) => {
      if (response.data.status_description === "Failed.") {
        res.status(204).json({
          response: response.data,
          status: "Error in Search String",
        });
      } else {
        res.status(200).json({
          response: response.data,
          status: "Success",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(503).json({
        error,
      });
    });
});
app.listen(port, () => console.log(`App listening on port ${port}!`));
