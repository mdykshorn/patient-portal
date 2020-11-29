// const fs = require("fs");
require("machinelearn-node");

var DataFrame = require("dataframe-js").DataFrame;
// const forest = require("./../../ckdForest");

var RandomForestClassifier = require("machinelearn/ensemble")
  .RandomForestClassifier;

// Random Forest Model
const randomForest = new RandomForestClassifier();

async function setupModel() {
  DataFrame.fromCSV(
    "https://raw.githubusercontent.com/mdykshorn/patient-portal/main/prognosis_model/cleaned_ckd_data.csv"
  ).then((df) => {
    console.log(df.listColumns());
    var features = df
      .select(
        "age",
        "bp",
        "sg",
        "rbc",
        "bgr",
        "sc",
        "sod",
        "hemo",
        "wbcc",
        "rbcc",
        "htn",
        "dm"
      )
      .toArray();
    var labels = df.select("class").toArray();

    console.log("Data Loaded");

    randomForest.fit(features, labels);
    console.log("Model Trained");

    const result = randomForest.predict([features[0]]);
    console.log("Test Prediction");
    console.log(result);

    // var jsonForest = randomForest.toJSON();
    // fs.writeFile("ckdForest.json", JSON.stringify(jsonForest), function (err) {
    //   if (err) throw err;
    //   console.log("File Write Complete");
    // });
  });
}

module.exports.setupModel = setupModel;

// console.log("Loading Model");
// randomForest.fromJSON(forest);
// console.log(randomForest);
// console.log("Model Loaded");

// var testObs = [
//   "48.0",
//   "80.0",
//   "1.020",
//   "0",
//   "121.0",
//   "1.2",
//   "0.0",
//   "15.4",
//   "7800.0",
//   "5.2",
//   "0",
//   "0",
// ];
// result = randomForest.predict([testObs]);
// console.log(result[0]);

// Needed to build tree and save json
// Uncomment to rebuild
// setupModel();

function getPrognosis(Observations) {
  result = randomForest.predict([Observations]);
  return result[0];
}

module.exports.getPrognosis = getPrognosis;
