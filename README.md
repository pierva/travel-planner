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


## Host application on heroku

In order to deploy the application in heroku, it is necessary to make few changes.
 1. The servers should liste to process.env.PORT as Heroku dinamically assign a port, therefore it can't be hardcoded
 2. Any call to the backend server should have the url changed to `window.origin.location`
 3. Add the following script in package.json 
    ```js
    "heroku-postbuild": "webpack --config webpack.prod.js"
    ```
   The script for the post build should match the production build script used in package.json

 4. Login to heroku.com and create a new app
 5. Install the Heroku CLI toolbelt in order to use heroku commands in the terminal
 6. Add the heroku application origin with 
    ```sh
    $ heroku git:remote -a <your-app-name>
    ```
 7. Push the repository to heroku with (you can push only the master branch):
    ```sh
    $ git push heroku master
    ```
 8. If your application uses environment variables, open the app settings in heroku website and add the environment variables there 
