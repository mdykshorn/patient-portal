const express = require("express");
const fhirKitClient = require("fhir-kit-client");

const config = { baseUrl: "https://hapi.fhir.org/baseDstu3" };
const client = new fhirKitClient(config);

const app = express();

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("build"));
}

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

app.listen(app.get("port"), () => {
  console.log("Express server started");
});
