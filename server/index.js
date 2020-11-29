const express = require("express");
const fhirKitClient = require("fhir-kit-client");
const fhir = require("./helpers/fhir");
var bodyParser = require("body-parser");
const path = require("path");
const cluster = require("cluster");
prognosisModel = require("./helpers/prognosis");
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

  app.use(bodyParser.json());

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));

  const apiRouter = require("./routes/apiRoutes");
  const loginRouter = require("./routes/loginRoutes");

  app.use("/api", apiRouter);
  app.use("/user", loginRouter);

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

  // Build model after server starts
  prognosisModel.setupModel();
}
