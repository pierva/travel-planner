// test apiHandler.js
import request from '../request'
jest.mock('../request')

const handleSubmit = (url, address) => {
    return request(url, address).then(data => data)
}


it('should validate the url', async () => {
    expect.assertions(2)
    try {
        await handleSubmit('xxxxxx', 'Miami')
    } catch (e) {
        expect(e.error).toEqual('Invalid URL')
    }

    try {
        await handleSubmit('http://api.geonames.org/geoCodeAddressJSON?q=', '')
    } catch (e) {
        expect(e.error).toEqual('Invalid address')
    }
})

it('should call pixabay API and return data', async () => {
    return handleSubmit('http://api.geonames.org/geoCodeAddressJSON?q=', 'London')
        .then(data => expect(data.address.locality).toBe('London'))
})