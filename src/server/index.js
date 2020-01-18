const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


// Configure environment variables
const dotenv = require('dotenv')
dotenv.config()

// Initialize darksky sdk
const DarkSky = require('dark-sky')
const darksky = new DarkSky(process.env.DARKSKY_API_KEY)

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
    res.sendFile('./dist/index.html')
})

/**
 * The /weather endpoint will call the darksky API to get the weather
 * forecast for the date provided in the body.
 * The parameter time is an ISO date string.
 * If no time is provided, or the date is in less than 3 days from 
 * the current date, the option time will not be provided to Darksky.
 * 
 * When using darksky time machine forecast (providing time parameter),
 * expect only one data group in the "daily.data" array.
 * 
 * If no time parameter is provide, the "daily.data" array will have
 * 8 objects. 
 */
app.post('/weather', async (req, res) => {
    const { lat, lon, time } = req.body
    let daysToNow = 0
    if (time) {
        const diff = new Date(time) - new Date()
        daysToNow = diff/36e5/24
    }
    if(!lat || !lon){
        return res.send({
            error: 'Invalid coordinates',
            status: 400
        })
    }
    try {
        const forecast = await darksky
        // If within 3 days, exclude time
            .options({
                latitude: lat,
                longitude: lon,
                time: daysToNow < 3 ? '' : time,
                units: 'si',
                exclude: ['minutely', 'hourly']
            })
            .get()
        res.status(200).json(forecast)
    } catch (err){
        return res.json(
            {
                error: 'Darksky API error', 
                message: err
            }
            )
    }
})

// Start the server
app.listen(process.env.PORT || PORT, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

module.exports = app