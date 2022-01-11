const http = require('http');
const listen = require('test-listen');
const fetch = require('node-fetch');
const config = require('../config');
const hive = require('../hive');
const handler = require('../index');

jest.mock('../hive');

describe('my endpoint', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle Hive DDL statement via HTTP POST', async () => {
    const connection = {
      close: jest.fn(),
    };

    const result = [{
      data: 1,
    }];

    hive.connect.mockResolvedValue(connection);
    hive.execute.mockResolvedValue(result);

    const server = new http.Server(handler);

    const statement = 'SELECT * from table';
    const body = JSON.stringify({
      statement,
    });

    const url = await listen(server);
    const response = await fetch(url, {
      method: 'POST',
      body,
    });

    const data = await response.json();

    expect(hive.connect).toHaveBeenCalledWith({
      host: config.HIVE_HOST,
      port: config.HIVE_PORT,
      username: config.HIVE_USERNAME,
      password: config.HIVE_PASSWORD,
    });

    expect(hive.execute).toHaveBeenCalledWith(connection, statement);
    expect(connection.close).toHaveBeenCalled();
    expect(data).toEqual(result);

    server.close();
  });

  it('should return 500 for any Hive error', async () => {
    const error = new Error('Network error');
    hive.connect.mockRejectedValue(error);

    const server = new http.Server(handler);

    const statement = 'SELECT * from table';
    const body = JSON.stringify({
      statement,
    });

    const url = await listen(server);
    const response = await fetch(url, {
      method: 'POST',
      body,
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      message: error.message,
    });

    server.close();
  });

  it('should return 405 Method Not Allowed if request method is different from POST', async () => {
    const server = new http.Server(handler);

    const url = await listen(server);
    const response = await fetch(url);

    expect(response.status).toBe(405);

    server.close();
  });

  it('should return 400 Bad Request for a payload without a statement', async () => {
    const server = new http.Server(handler);
    const body = JSON.stringify({
      foo: 'bar',
    });

    const url = await listen(server);
    const response = await fetch(url, {
      method: 'POST',
      body,
    });

    expect(response.status).toBe(400);

    server.close();
  });
});
