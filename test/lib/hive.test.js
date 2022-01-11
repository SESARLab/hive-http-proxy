const hive = require('hive-driver');
const { connect, execute } = require('../../lib/hive');

jest.mock('hive-driver', () => ({
  ...jest.requireActual('hive-driver'),
  HiveClient: jest.fn(),
  HiveUtils: jest.fn(),
}));

const client = {
  connect: jest.fn(),
  openSession: jest.fn(),
};

const utils = {
  waitUntilReady: jest.fn(),
  fetchAll: jest.fn(),
  getResult: jest.fn(),
};

const session = {
  executeStatement: jest.fn(),
  close: jest.fn(),
};

const operation = {
  close: jest.fn(),
};

const operationResult = {
  getValue: jest.fn(),
};

const data = [{
  data: 1,
}];

describe('hive', () => {
  beforeEach(() => {
    hive.HiveClient.mockReturnValue(client);
    hive.HiveUtils.mockReturnValue(utils);

    client.connect.mockReturnThis();
    client.openSession.mockResolvedValue(session);

    session.executeStatement.mockResolvedValue(operation);

    utils.getResult.mockReturnValue(operationResult);
    operationResult.getValue.mockReturnValue(data);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('connect', () => {
    it('should a connect to the specified Apache Hive server', async () => {
      const params = {
        host: 'localhost',
        port: 10000,
        username: 'user',
        password: 'password',
      };

      const connection = await connect(params);

      expect(connection).toBe(client);
      expect(client.connect).toHaveBeenCalledWith(
        {
          host: params.host,
          port: params.port,
        },
        new hive.connections.TcpConnection(),
        new hive.auth.PlainTcpAuthentication({
          username: params.username,
          password: params.password,
        }),
      );
    });
  });

  describe('execute', () => {
    it('should open a session for the given connection and execute the required statement', async () => {
      const statement = 'SELECT * FROM table';

      const result = await execute(client, statement);

      expect(client.openSession).toHaveBeenCalledWith({
        client_protocol: hive.thrift.TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10,
      });
      expect(session.executeStatement).toHaveBeenCalledWith(statement, {
        runAsync: true,
      });
      expect(utils.waitUntilReady).toHaveBeenCalledWith(operation, false);
      expect(utils.fetchAll).toHaveBeenCalledWith(operation);
      expect(utils.getResult).toHaveBeenCalledWith(operation);
      expect(operationResult.getValue).toHaveBeenCalled();
      expect(session.close).toHaveBeenCalled();
      expect(result).toEqual(data);
    });
  });
});
