require("dotenv").config(); 
const express = require("express");
const cookieParser = require("cookie-parser");



const app = express();
const userRouter = require("./api/users/user.router");
var cors = require('cors');

app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    next();
  });

app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRouter);

app.listen(process.env.APP_PORT, () => {
    console.log("Server UP and Running on port :", process.env.APP_PORT);
    
});
