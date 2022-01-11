const { json, send } = require('micro');
const config = require('./config');
const hive = require('./hive');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return send(res, 405, {
      message: 'Method Not Allowed',
    });
  }

  const { statement } = await json(req);

  if (!statement) {
    return send(res, 400, {
      message: `Invalid statement. Statement payload must have this form: {
        "statement": "SELECT 1"
      }`,
    });
  }

  const connection = await hive.connect({
    host: config.HIVE_HOST,
    port: config.HIVE_PORT,
    username: config.HIVE_USER,
    password: config.HIVE_PASSWORD,
  });
  const data = await hive.execute(connection, statement);
  connection.close();

  return send(res, 200, data);
};
