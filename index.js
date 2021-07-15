//modules
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.SECRET_KEY);

//Environments
require('dotenv').config();
//Initialize app
const app = express();

//App setting
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//set up view engines
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//App request routes
app.get('/', (req, res) =>{
    res.render('Home',{key: process.env.PUBLISHABLE_KEY});
});

app.listen(process.env.PORT, (port)=>{
    console.log(`Stripe is running on PORT ${process.env.PORT}`);
});
