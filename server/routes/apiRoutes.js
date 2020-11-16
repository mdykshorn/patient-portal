const express = require("express");
const apiRouter = express.Router();

const fhir = require("../controllers/fhir");

apiRouter.route("/patient").get(fhir.getPatient);

apiRouter.route("/patient/:pid").get(fhir.getPatientById);

apiRouter.route("/observation").post(fhir.createObservation);

module.exports = apiRouter;
