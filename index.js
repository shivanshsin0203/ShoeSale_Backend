const express = require("express");
const nike=require('./nike');
const adidas=require('./addidas');
const puma=require('./puma'); 
const app = express();
const port = 3005;
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get("/test", (req, res) => {
    res.json({data:puma});
    });
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
