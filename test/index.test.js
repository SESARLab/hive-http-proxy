const http = require('http');
const listen = require('test-listen');
const fetch = require('node-fetch');
const handler = require('../index');

describe('my endpoint', () => {
  it('should return 405  Method Not Allowed if request method is different from POST', async () => {
    const server = new http.Server(handler);

    const url = await listen(server);
    const response = await fetch(url);

    expect(response.status).toBe(405);

    server.close();
  });
});
