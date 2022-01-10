const { json, send } = require('micro');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return send(res, 405, {
      message: 'Method Not Allowed',
    });
  }

  const data = await json(req);
  console.log(data);

  return send(res, 200, data);
};
