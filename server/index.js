const express = require("express");
const fhirKitClient = require("fhir-kit-client");
const fhir = require("./controllers/fhir");
var bodyParser = require("body-parser");
const path = require("path");
const cluster = require("cluster");
const { getUnixTime } = require("date-fns");
const numCPUs = require("os").cpus().length;

const isDev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;

const config = { baseUrl: "https://hapi.fhir.org/baseDstu3" };
const client = new fhirKitClient(config);

var jsonParser = bodyParser.json();

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
          var name = "";
          if (response.name) {
            name = `${response.name[0].given} ${response.name[0].family}`;
          }
          var patient = {
            id: response.id,
            name: name,
            birthDate: response.birthDate,
          };

          return patient;
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ patient: { id: req.params.pid } });
        }),
      client
        .search({ resourceType: "Observation", searchParams: { subject: pid } })
        .then((response) => {
          return fhir.parseObservations(response.entry);
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ patient: { id: req.params.pid } });
        }),
    ]).then((data) => {
      var prognosis = fhir.getPrognosis(data[1]);
      var data = {
        patient: data[0],
        observations: data[1],
        prognosis: prognosis,
      };
      res.status(200).json(data);
    });
  });

  app.post("/api/observation", jsonParser, function (req, res) {
    const obsType = req.body.observationType.obsType;

    const quantity = {
      value: req.body.value,
      unit: fhir.getMapping(obsType.code),
      system: "http://unitsofmeasure.org",
    };

    const newCode = {
      coding: [
        {
          system: "http://loinc.org",
          code: obsType.code,
          display: obsType.value,
        },
      ],
    };

    const ref = {
      reference: "Patient/" + req.body.patientId,
      id: req.body.patientId,
      type: "Patient",
    };

    const newObservation = {
      resourceType: "Observation",
      active: true,
      code: newCode,
      valueQuantity: quantity,
      subject: ref,
      effectiveDateTime: new Date(req.body.date).toISOString(),
    };

    client
      .create({
        resourceType: "Observation",
        body: JSON.stringify(newObservation),
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      })
      .then((data) => {
        console.log("added observation");
        console.log(JSON.stringify(data));
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        res.status(400).json({ patient: { id: req.params.pid } });
      }),
      res.status(400);
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
