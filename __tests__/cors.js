const app = require('../app')
const request = require('supertest');
const mongoose = require('mongoose')
let server

describe.each(['/orders', '/users', '/records'])('Cors in %s', path => {
    test('Cors in GET ' + path, async (done) => {
        const res = await request(app).get(path)

        expect(res.headers).toEqual(
            expect.objectContaining({
                'access-control-allow-origin': expect.anything(),
                'access-control-allow-headers': expect.anything(),
                'access-control-allow-methods': expect.stringContaining('GET')
            })
        )
        done()
    })

    test('Content type json in GET ' + path, async (done) => {
        const res = await request(app).get(path)
        expect(res.headers).toEqual(
            expect.objectContaining({
                'content-type': expect.stringContaining('application/json')
            })
        )
        done()
    })
})

beforeAll(async (done) => {
    server = app.listen(3000, () => {
        global.agent = request.agent(server);
        done();
    });
});
  
afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
});