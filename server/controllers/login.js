const db = require("./../helpers/database");
var md5 = require("md5");

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

async function login(req, res) {
  var sql = "SELECT * FROM user where (email==?) AND (password==?)";
  var params = [req.body.email, req.body.password];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (row) {
      console.log(row);
      res.json({
        message: "success",
        data: row,
      });
    } else {
      res.status(401).json({ error: "Incorrect email or password" });
    }
  });
}

module.exports.login = login;

async function register(req, res) {
  var errors = [];
  if (!req.body.password) {
    errors.push("No password specified");
  }
  if (!req.body.email) {
    errors.push("No email specified");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  var patient_id = 1689380; //TODO make this a real patient id
  if (!req.body.patient_id) {
    // create patient record in fhir server
  }

  var data = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
    patient_id: patient_id,
  };

  var sql =
    "INSERT INTO user (name, email, password, patient_id) VALUES (?,?,?,?)";
  var params = [data.name, data.email, data.password, data.patient_id];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: data,
    });
  });
}

module.exports.register = register;

async function logout(req, res) {}

module.exports.logout = logout;
