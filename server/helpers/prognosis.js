require("machinelearn-node");

var DataFrame = require("dataframe-js").DataFrame;
var RandomForestClassifier = require("machinelearn/ensemble")
  .RandomForestClassifier;

// Random Forest Model
const randomForest = new RandomForestClassifier();
// simple Random Forest Model
const simpleRandomForest = new RandomForestClassifier();

async function setupModel() {
  DataFrame.fromCSV(
    "https://raw.githubusercontent.com/mdykshorn/patient-portal/main/prognosis_model/cleaned_ckd_data.csv"
  ).then((df) => {
    // uncomment for dev, remove for prod
    df = df.slice(0, 2);

    console.log(df.listColumns());
    var features = df
      .select("age", "bp", "sg", "al", "bgr", "sc", "sod", "hemo", "htn")
      .toArray();
    var labels = df.select("class").toArray();

    console.log("Data Loaded");

    randomForest.fit(features, labels);
    console.log("Model Trained");

    const result = randomForest.predict([features[0]]);
    console.log("Test Prediction");
    console.log(result);
  });

  // Simple model
  DataFrame.fromCSV(
    "https://raw.githubusercontent.com/mdykshorn/patient-portal/main/prognosis_model/cleaned_ckd_simple_data.csv"
  ).then((df) => {
    // uncomment for dev, remove for prod
    df = df.slice(0, 2);

    console.log(df.listColumns());
    var features = df.select("age", "bp", "sg", "sc", "htn").toArray();
    var labels = df.select("class").toArray();

    console.log("Simple Data Loaded");

    randomForest.fit(features, labels);
    console.log("Simple Model Trained");

    const result = randomForest.predict([features[0]]);
    console.log("Simple Test Prediction");
    console.log(result);
  });
}

module.exports.setupModel = setupModel;

function getPrognosis(Observations) {
  result = randomForest.predict([Observations]);
  return result[0];
}

module.exports.getPrognosis = getPrognosis;

function getSimplePrognosis(Observations) {
  result = simpleRandomForest.predict([Observations]);
  return result[0];
}

module.exports.getSimplePrognosis = getSimplePrognosis;
