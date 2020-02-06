# The travel planner app

This application is the Capstone project of the Front-End Web Developer Nanodegree (Udacity).

## Get started 

Install all the dependencies with:
```sh
$ npm install
```
The application uses DarkSky API, Geonames API and Pixabay API.
In order to use the APIs you need to configure the keys in the .env file.
Create a new `.env` file in the root of your project and add:

DARKSKY_API_KEY=<your-key>
PIXABAY_API_KEY=<your-key>

One more configuration need to be done in the apiHandler file.
Open the `apiHandler.js` file located in `src/client/js/` and add your Pixabay username under `geonamesUser` key.

### Start the application in dev mode
In order to use the dev mode you need to run the express server and the webpack server. You need two terminals to run both servers:

**Terminal 1**
```
$ npm run start-dev
```

**Terminal 2**
```
$ npm run build-dev
```

### Build the production distribution
You can build the dist folder with the command:
```sh
$ npm run build-prod
```

And you can serve the distribution folder from the express server by navigating to http://localhost:8081/

In order to visit port 8081 on localhost, you need to have the express server running, either in production or development mode.