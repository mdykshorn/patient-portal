const db = require("./../helpers/database");

async function users(req, res) {
  var sql = "select * from user";
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
}

module.exports.users = users;

async function login(req, res) {}

module.exports.login = login;

async function register(req, res) {}

module.exports.register = register;

async function logout(req, res) {}

module.exports.logout = logout;
