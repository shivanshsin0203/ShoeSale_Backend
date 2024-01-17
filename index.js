const express = require("express");
const nike = require("./nike");
const adidas = require("./addidas");
const puma = require("./puma");
const app = express();
const port = 3005;
const bodyParser = require("body-parser");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51OZVowSBfIgpwKKIlxkdSlXGJ7Ibs2thzqpo2zN5jh38cPA7e8IHI3eNxDDG4Wvfr0419CcgqLD0SKH76PvNy1nL00YKnVq4W2");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.get("/initial", (req, res) => {
  res.json({ data: adidas });
});
app.post("/product", (req, res) => {
  console.log(req.body);
  let receivedBrands = ['nike'];
  if(req.body.brands.length>0){
   receivedBrands = req.body.brands || ['nike'];}
  const allBrands = getItemsFromBrands(receivedBrands);
  const sortOption = req.body.sortOption || "lowToHigh";
  console.log(req.body.sortOption);
  const sortedItems = sortItems(allBrands, sortOption);

  res.json({ data: sortedItems });
});
app.post("/api/create-checkout-session",async(req,res)=>{
  const {products} = req.body;


  const lineItems = products.map((product)=>({
      price_data:{
          currency:"inr",
          product_data:{
              name:product.title,
              
          },
          unit_amount:product.price * 8200,
      },
      quantity:product.cartQantity,
  }));

  const session = await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:lineItems,
      mode:"payment",
      success_url:"https://localhost:5173/success",
      cancel_url:"https://localhost:5173/cancel",
  });

  res.json({id:session.id})

})
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

function getItemsFromBrands(brands) {
  let items = [];
  brands.forEach((brand) => {
    switch (brand.toLowerCase()) {
      case 'nike':
        items = items.concat(nike.items);
        break;
      case 'adidas':
        items = items.concat(adidas.items);
        break;
      case 'puma':
        items = items.concat(puma.items);
        break;
      // Add cases for other brands if needed
      default:
        break;
    }
  });
  return items;
}
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
