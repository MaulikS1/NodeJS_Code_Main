require("dotenv").config(); 
const express = require("express");


const app = express();
const userRouter = require("./api/users/user.router");
var cors = require('cors')


app.use(cors()) 

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.json());
app.use("/api/users", userRouter);

app.listen(process.env.APP_PORT, () => {
    console.log("Server UP and Running on port :", process.env.APP_PORT);
    
});
