/*
SQLite db functionality for user storage
adapted from here: https://developerhowto.com/2018/12/29/build-a-rest-api-with-node-js-and-express-js/
*/

var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "user_db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            patient_id text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
      (err) => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          var insert =
            "INSERT INTO user (name, email, password, patient_id) VALUES (?,?,?,?)";
          db.run(insert, [
            "admin",
            "admin@example.com",
            md5("admin123456"),
            "Patient-BD-Pa5",
          ]);
          db.run(insert, [
            "user",
            "user@example.com",
            md5("user123456"),
            "Patient-BD-Pa5",
          ]);
          db.run(insert, [
            "Brian Green",
            "bgreen@test.com",
            md5("test123"),
            "512998",
          ]);
        }
      }
    );
  }
});

module.exports = db;
