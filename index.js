const { json, send } = require('micro');

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

  // const connection = await connect();
  // const data = await execute(statement);
  // connection.close()

  return send(res, 200, {});
};
