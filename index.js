//Checking environment 
if(process.env.NODE_ENV !== 'production'){
    //Environments
    require('dotenv').config(); 
}
//modules
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.SECRET_KEY);
const fs = require('fs');
//Initialize app
const app = express();

//App setting
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//set up view engines
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
//App request routes
app.get('/store', (req, res) =>{
    fs.readFile('items.json', (err, data) =>{
        if(err){
            res.status(500).end();
        }else{
            res.render('store.ejs', {
                stripePublicKey: process.env.PUBLISHABLE_KEY,
                items: JSON.parse(data)
            });
        }
    });
});
//post request
app.post('/purchase', (req, res) =>{
    fs.readFile('items.json', (err, data) =>{
        if(err){
            res.status(500).end();
        }else{
           const itemsJson = JSON.parse(data);
           const itemsArray = itemsJson.music.concat(itemsJson.merch);
           let total = 0;
           req.body.items.forEach( (item) => {
                const itemJson = itemsArray.find( (j) =>{
                    return j.id === Number(item.id);
                });
                total = total + (itemJson.price * item.quantity);
           });
           stripe.charges.create({
               amount: total,
               source: req.body.stripeTokenId,
               currency : 'usd'
           }).then(()=>{
               console.log("Charge successful");
               res.json({message: "Successfully purchased the items"});
           }).catch(()=>{
               console.log("Charge failed");
               res.status(500).end();
           });
        }
    });
});

app.listen(process.env.PORT, (port)=>{
    console.log(`Stripe is running on PORT ${process.env.PORT}`);
});
