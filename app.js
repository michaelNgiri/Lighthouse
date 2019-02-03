const express = require('express');
const request = require('request');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const opencage = require('opencage-api-client');

fs = require('fs');

require('dotenv').config();



const port = process.env.PORT || 5000;












//set up server at this port
app.listen(port, (err)=>{
    if(err){
        console.log(err);
    }
    console.log('server started at port: ' + port);
});