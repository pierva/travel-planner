const request = require('supertest')
const app = require('../src/server')
require("regenerator-runtime")


// Check that API credentials are configured in dotenv
describe("Check DarkSky and Pixabay API keys", () => {
    it('should find API credentials env', () => {
        expect(process.env.DARKSKY_API_KEY).not.toBe(undefined)
        expect(process.env.PIXABAY_API_KEY).not.toBe(undefined)
    })
})


describe('Test pictures endpoint', () => {
    // Validation tests
    test('it should get status 400 for undefined destination', async (done) => {
        const res = await request(app)
            .get('/pictures/undefined')
        expect(res.statusCode).toEqual(400)
        expect(res.text).not.toBe(undefined)
        expect(JSON.parse(res.text)).toHaveProperty('error')
        done()
    })

    // Success call test
    test('it should get pictures data for valid destination', async (done) => {
        const res = await request(app)
            .get('/pictures/miami')
        expect(res.statusCode).toEqual(200)
        expect(res.text).not.toBe(undefined)
        expect(JSON.parse(res.text)).toHaveProperty('hits')
        done()
    })
})


describe('Test weather endpoint', () => {
    // Validation test
    test('it should return status 400 for invalid coordinates', async (done) => {
        const res = await request(app)
            .post('/weather')
            .send({
                lat: undefined,
                lon: undefined
            })
        expect(res.statusCode).toEqual(400)
        expect(JSON.parse(res.text).error).toBe('Invalid coordinates')
        done()
    })

    // Valid call test
    test('it should get weather forecast for valid coordinates', async (done) => {
        const res = await request(app)
            .post('/weather')
            .send({
                lat: 25.7617,
                lon: 80.1918,
                time: 1581125662
            })
            expect(res.statusCode).toEqual(200)
            done()
    })
})