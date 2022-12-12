const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
// const sessions = require('express-session')
const db = require('./src/config/database.config.js')
// creating of express app
const app = express();
var cors = require('cors');
// use body parser to decode query params and json body.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
/**
 *
 * const cors = require('cors');

 * 
 */
// port set-up
const port = process.env.PORT || 8000;

require("./src/routes/route")(app, db)


// let origins = ["http://localhost:3000"];
// if (process.env.NODE_ENV === "development")
//     origins.push("http://localhost:3000");
// app.use(function (req, res, next) {
//     if (origins.includes(req.headers.origin)) {
//         res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
//     }
//     res.header("Access-Control-Allow-Origin", "*") // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Methods", "GET,POST,DELETE");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });
// app.use(function(req,res,next){
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header("Access-Control-Allow-Methods", "GET,POST,DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// })
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// server listening
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});

