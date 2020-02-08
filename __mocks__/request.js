// __mocks__/request.js

const mockResponse = {
        "address": {
            "adminCode2": "115",
            "adminCode3": "",
            "adminCode1": "AR",
            "adminName2": "Pope",
            "lng": "-93.24417",
            "street": "State Hwy 333",
            "postalcode": "",
            "countryCode": "US",
            "houseNumber": "",
            "locality": "London",
            "adminName1": "Arkansas",
            "lat": "35.32398"
        }
}

export default function request(url, address) {
    return new Promise((resolve, reject) => {
      if(!url) {
        reject({
          error: 'Invalid endpoint'
        })
      }
      if(url !== 'http://api.geonames.org/geoCodeAddressJSON?q=') {
          reject({
              error: 'Invalid URL'
          })
      }
      if(!address || address.trim().length === 0) {
        reject({
          error: 'Invalid address'
        })
      } 
      resolve(mockResponse)
    })
  }