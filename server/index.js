const express = require("express");
const fhirKitClient = require("fhir-kit-client");
const path = require("path");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));

  app.get("/api/patient", (req, res) => {
    if (req.query.name) {
      client
        .search({
          resourceType: "Patient",
          searchParams: { name: req.query.name },
        })
        .then((response) => {
          const patients = response.entry
            ? response.entry.map((obj) => {
                console.log(obj);
                return {
                  id: obj.resource.id,
                  name: `${obj.resource.name[0].given} ${obj.resource.name[0].family}`,
                  gender: obj.resource.gender,
                  birthDate: obj.resource.birthDate,
                  imageURL: "",
                };
              })
            : [];

          res.status(200).json(patients);
        });
    } else {
      res.status(200).json({ patients: [] });
    }
  });

  app.get("/api/patient/:pid", (req, res) => {
    var pid = req.params.pid;

    Promise.all([
      client
        .read({
          resourceType: "Patient",
          id: pid,
        })
        .then((response) => {
          console.log(response);

          var patient = {
            id: response.id,
            name: `${response.name[0].given} ${response.name[0].family}`,
            birthDate: response.birthDate,
          };

          return patient;
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ patient: { id: req.params.pid } });
        }),
      client
        .read({
          resourceType: "Patient",
          id: pid,
        })
        .then((response) => {
          console.log(response);

          var patient = {
            id: response.id,
            name: `${response.name[0].given} ${response.name[0].family}`,
            birthDate: response.birthDate,
          };
          return patient;
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ patient: { id: req.params.pid } });
        }),
    ]).then((data) => {
      var patient = data[0];
      res.status(200).json(patient);
    });
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get("*", function (request, response) {
    response.sendFile(
      path.resolve(__dirname, "../frontend/build", "index.html")
    );
  });

  app.listen(PORT, function () {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}
