const hive = require('hive-driver');

const { TCLIService, TCLIService_types } = hive.thrift;

function createClient() {
  return new hive.HiveClient(
    TCLIService,
    TCLIService_types,
  );
}

function createUtils() {
  return new hive.HiveUtils(
    TCLIService_types,
  );
}

async function connect({
  host, port, username, password,
}) {
  const client = createClient();

  return client.connect(
    {
      host,
      port,
    },
    new hive.connections.TcpConnection(),
    new hive.auth.PlainTcpAuthentication({
      username,
      password,
    }),
  );
}

async function execute(connection, statement) {
  const utils = createUtils();

  const session = await connection.openSession({
    client_protocol: hive.thrift.TCLIService_types.TProtocolVersion.HIVE_CLI_SERVICE_PROTOCOL_V10,
  });

  const operation = await session.executeStatement(statement, {
    runAsync: true,
  });
  await utils.waitUntilReady(operation, false);
  await utils.fetchAll(operation);
  await operation.close();

  const result = utils.getResult(operation).getValue();

  await session.close();

  return result;
}

module.exports = {
  connect,
  execute,
};
