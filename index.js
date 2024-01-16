const express = require("express");
const nike = require("./nike");
const adidas = require("./addidas");
const puma = require("./puma");
const app = express();
const port = 3005;
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get("/initial", (req, res) => {
  res.json({ data: adidas });
});
app.post("/product", (req, res) => {
  console.log(req.body);
  const allBrands = [].concat(nike.items, adidas.items, puma.items);
  const sortOption = req.body.sortOption || "lowToHigh";
  console.log(req.body.sortOption);
  const sortedItems = sortItems(allBrands, sortOption);

  res.json({ data: sortedItems });
});
function sortItems(items, sortOption) {
  return items.sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);

    if (sortOption === 'highToLow') {
      return priceB - priceA;
    } else {
      return priceA - priceB;
    }
  });
}
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
