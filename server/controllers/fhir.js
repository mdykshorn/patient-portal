/*
Functions to handle the api routes

*/
const fhirKitClient = require("fhir-kit-client");
const config = require("./../config/fhir");
const client = new fhirKitClient(config);
const fhir = require("../helpers/fhir");
const prognosis = require("./../helpers/prognosis");

async function getPatient(req, res) {
  console.log("getting patient");
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
}

module.exports.getPatient = getPatient;

async function getPatientById(req, res) {
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
    var prognosis = fhir.getPrognosis(data[1], data[0].birthDate);
    var data = {
      patient: data[0],
      observations: data[1],
      prognosis: prognosis,
    };
    res.status(200).json(data);
  });
}

module.exports.getPatientById = getPatientById;

async function createObservation(req, res) {
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
}

module.exports.createObservation = createObservation;

async function createPatient(inData) {
  var patient = {
    resourceType: "Patient",
    identifier: [{ system: "iga-buddy", value: inData.firstname + inData.dob }],
    name: [
      {
        family: inData.lastname,
        given: inData.firstname,
      },
    ],
    gender: inData.gender,
    birthDate: new Date(inData.dob).toISOString(),
    active: true,
  };

  return new Promise((resolve, reject) => {
    if (inData.id) {
      resolve(inData.id);
    }
    client
      .create({
        resourceType: "Patient",
        body: JSON.stringify(patient),
        options: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      })
      .then((data) => {
        console.log("added patient; ID:", data.id);
        resolve(data.id);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        reject("0");
      });
  });
}

module.exports.createPatient = createPatient;
