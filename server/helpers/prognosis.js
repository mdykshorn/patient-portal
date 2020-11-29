var DataFrame = require("dataframe-js").DataFrame;
var RandomForestClassifier = require("machinelearn/ensemble")
  .RandomForestClassifier;

// Random Forest Model
const randomForest = new RandomForestClassifier();

async function setupModel() {
  DataFrame.fromCSV(
    "https://raw.githubusercontent.com/mdykshorn/patient-portal/main/prognosis_model/cleaned_ckd_data.csv"
  ).then((df) => {
    // for dev only use small subset of df, remove for production
    // df = df.slice(0, 2);

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
  });
}

module.exports.setupModel = setupModel;

function getPrognosis(Observations) {
  result = randomForest.predict([Observations]);
  return result[0];
}

module.exports.getPrognosis = getPrognosis;
