const app = require('../app')
const request = require('supertest');
const { ExpectationFailed } = require('http-errors');

describe.each(['/orders', '/users', '/records'])('Cors in %s', path => {
    test('Cors in GET ' + path, async () => {
        const res = await request(app).get(path)

        expect(res.headers).toEqual(
            expect.objectContaining({
                'access-control-allow-origin': expect.anything(),
                'access-control-allow-headers': expect.anything(),
                'access-control-allow-methods': expect.stringContaining('GET')
            })
        )
    })

    test('Content type json in GET ' + path, async () => {
        const res = await request(app).get(path)
        expect(res.headers).toEqual(
            expect.objectContaining({
                'content-type': expect.stringContaining('application/json')
            })
        )
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
});