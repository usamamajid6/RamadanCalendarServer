const express = require("express");
const app = express();
const port = process.env.PORT || 2222;
const axios = require("axios");
const key = require("./MuslimSalatAPIKey");
const cors = require("cors");
const nodeHtmlToImage = require("node-html-to-image");
const dateFormat = require("dateformat");
const genrateImage = (data, city_name, cb) => {
  const styles = `
  body{
    text-align:center;
    padding: 10px;
    background-color:lightblue
  }

  .headContainer{
    padding: 16px 0 0 0;
    color:blue;
  }

  table.tableClass {
    padding: 0 0 24px 0;
    border: 10px solid #1B5DA4;
    background-color: #EEEDE3;
    width: 100%;
    text-align: center;
    // border-collapse: collapse;
  }
  table.tableClass td, table.tableClass th {
    border: 1px solid #AAAAAA;
    padding: 3px 9px;
  }
  table.tableClass tbody td {
    font-size: 14px;
    font-weight: bold;
  }
  table.tableClass tr:nth-child(even) {
    background: #D0E4F5;
  }
  table.tableClass thead {
    background: #1C6EA4;
    background: -moz-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
    background: -webkit-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
    background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
    border-bottom: 0px solid #444444;
  }
  table.tableClass thead th {
    font-size: 18px;
    font-weight: bold;
    color: #FFFFFF;
    text-align: center;
    border-left: 0px solid #D0E4F5;
  }
  table.tableClass thead th:first-child {
    border-left: none;
  }
  
  `;
  let tableData = ``;
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    tableData += `<tr> <td>${element.roza}</td> <td>${dateFormat(
      element.date_for,
      "fullDate"
    )}</td> <td>${element.fajr}</td> <td>${element.maghrib}</td><tr/>`;
  }
  let tableString = `
  <table class='tableClass'>
  <thead> <tr> <th>Roza #</th> <th>Date</th> <th>Sehri</th> <th>Aftari</th> </tr> </thead>
  <tbody>${tableData}
  </tbody>
</table>
  `;
  let completeHTML = `<html>
<head>
<style>
  ${styles}
  </style>
</head>
<body>
<div class="headContainer">
<h1>RAMADAN CALENDAR 2020</h1>
<h3>${city_name.toUpperCase()}</h3>
</div>
${tableString}</body>
</html>`;

  nodeHtmlToImage({
    output: "./image.png",
    html: completeHTML,
  })
    .then(() => {
      cb(true);
    })
    .catch(() => {
      cb(false);
    });
};

app.use(cors());
app.get("/", (req, res) => res.send("Hello World!"));
app.get("/getTimings/:city", (req, res) => {
  axios({
    method: "get",
    url: `https://muslimsalat.com/${req.params.city}/yearly/25-04-2020.json?key=${key}`,
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

app.get("/getImage/:city", (req, res) => {
  axios({
    method: "get",
    url: `https://muslimsalat.com/${req.params.city}/yearly/25-04-2020.json?key=${key}`,
  })
    .then((response) => {
      if (response.data.status_description === "Failed.") {
        res.status(204).json({
          response: response.data,
          status: "Error in Search String",
        });
      } else {
        let data = response.data.items;
        data.splice(30, data.length);
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          element.roza = i + 1;
        }
        genrateImage(data, req.params.city, (response) => {
          if(response){
            res.status(200).download('./image.png',`${req.params.city.trim()}.png`);
          }else{
            res.status(204).json({
              status: "Failed",
            });
          }
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
