const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Configure environment variables
const dotenv = require('dotenv')
dotenv.config()

// Port 8080 is used by webpack
const PORT = 8081
const app = express()

/* Middleware*/
//Configure express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure cors middleware
app.use(cors())

app.use(express.static('dist'))

// Serve the home page
app.get('/', function (req, res) {
    // res.sendFile('./dist/index.html')
    res.send('I am running!')
})

// Start the server
app.listen(process.env.PORT || PORT, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

module.exports = app