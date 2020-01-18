const apiStatic = {
    geonamesURI: 'http://api.geonames.org/geoCodeAddressJSON?q=',
    geonamesUser: 'piervalerio',
    baseUrl: 'http://localhost:8081', //Change it to window.location.origin in production
}

const apiHandler = {

    /**
    * This async function returns a geocoded address using the 
    * geonames api
    * @param {string} address
    * @returns {Promise}
    */
    geolocator: async (address) => {
        const URI = encodeURI(apiStatic.geonamesURI + address + '&username=' + apiStatic.geonamesUser)
        let response = await fetch(URI)
        let data = await response.json()

        // Check if there is data in the response
        if (!$.isEmptyObject(data)) {
            // If the object is not empty, check if we have the address key
            if (data.address) {
                return {
                    lat: data.address.lat,
                    lon: data.address.lng
                }
            }
            // Some error with the API
            else {
                return {
                    error: 'Something went wrong while processing your request',
                    data
                }
            }
        }
        return {
            error: 'No coordinates found',
            status: 404
        }
    },

    /**
     * getWeather is a post request to the backend server.
     * The server will handle the call to darksky api if valid 
     * coordinates are provided
     * 
     * @param {String} address Address to geolocate
     * @return {Promise}
     */

    getWeather: async (address, date) => {
        if(!address || address.trim() === '') {
            return {
                error: 'No destination provided',
                status: 400
            }
        }
        let coordinates = await apiHandler.geolocator(address)
        coordinates.time = date

        const response = await fetch(apiStatic.baseUrl + '/weather', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(coordinates)
        })

        try {
            const data = await response.json()
            console.log(data)
            return data
        } catch (error) {
            console.log(error);
            return error
        }
    }
}

export { apiHandler }