const prognosisModel = require("./../helpers/prognosis");
const loincData = require("./../config/observationMap");

const observationMapping = {
  "2160-0": {
    units: "mg/dL",
    name: "Creatinine [Mass/Vol]",
  },
  "48642-3": {
    units: "mL/min/{1.73_m2}",
    name: "GFR/BSA pr.non blk SerPlBld MDRD-ArV",
  },
  "8480-6": {
    units: "mm[Hg]",
    name: "Systolic blood pressure",
  },
  "8462-4": {
    units: "mm[Hg]",
    name: "Diastolic blood pressure",
  },
  "21482-5": {
    units: "mg/dl",
    name: "Protein (24H U) [Mass/Vol]",
  },
};

// helper function to get both systolic and diastolic bp
function getBloodPressureValue(BPObservations, typeOfPressure) {
  var formattedBPObservations = [];
  BPObservations.forEach(function (observation) {
    var BP = observation.component.find(function (component) {
      return component.code.coding.find(function (coding) {
        return coding.code == typeOfPressure;
      });
    });
    if (BP) {
      observation.valueQuantity = BP.valueQuantity;
      formattedBPObservations.push(observation);
    }
  });

  return getQuantityValueAndUnit(formattedBPObservations[0]);
}

module.exports = {
  parseObservations: async function (observations) {
    var filtered_observations = loincData;

    if (!observations) {
      return filtered_observations;
    }

    observations.forEach((obj) => {
      if (obj.resource.code.coding) {
        if (
          Object.keys(filtered_observations).includes(
            obj.resource.code.coding[0].code
          )
        ) {
          filtered_observations[obj.resource.code.coding[0].code].data.push([
            obj.resource.effectiveDateTime,
            obj.resource.valueQuantity.value,
          ]);
        }
      }
    });

    Object.keys(filtered_observations).forEach((obs) => {
      filtered_observations[obs]["data"].sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b[0]) - new Date(a[0]);
      });
      filtered_observations[obs]["recent"] = filtered_observations[obs][
        "data"
      ].slice(0)[0];
    });

    return filtered_observations;
  },
  getMapping: function (observationCode) {
    return observationMapping[observationCode];
  },
  /**
   * prognosis info pulled from the following paper:
   * https://www.uptodate.com/contents/treatment-and-prognosis-of-iga-nephropathy
   * @param {*} recentObservations
   */
  getPrognosis: function (recentObservations, birthDate) {
    var prognosis = {
      RiskFactor: 0.01,
      Standing: "no records",
      Percentile: "no records",
    };

    var overalProg = 0.1;

    if (recentObservations["2160-0"].recent) {
      var val = recentObservations["2160-0"].recent[1];

      if (val > 1.68) {
        prognosis["Percentile"] = 71;
        overalProg += 0.1;
      } else if (val > 1.26) {
        prognosis["Percentile"] = 26;
        overalProg += 0.5;
      } else {
        prognosis["Percentile"] = 2.5;
      }
    }
    if (recentObservations["48642-3"].recent) {
      var val = recentObservations["48642-3"].recent[1];
      if (val < 60) {
        overalProg += 0.2;
      }
    }
    if (recentObservations["8480-6"].recent) {
      var val = recentObservations["8480-6"].recent[1];
      if (val > 140) {
        overalProg += 0.1;
      }
    }
    if (recentObservations["8462-4"].recent) {
      var val = recentObservations["8462-4"].recent[1];
      if (val > 90) {
        overalProg += 0.1;
      }
    }
    if (recentObservations["21482-5"].recent) {
      var val = recentObservations["21482-5"].recent[1];
      if (val > 1000) {
        overalProg += 0.1;
      } else if (val > 3500) {
        overalProg += 0.3;
      }
    }
    prognosis["RiskFactor"] = overalProg;

    if (overalProg < 0.2) {
      prognosis["Standing"] = "good";
    } else if (overalProg < 0.4) {
      prognosis["Standing"] = "at risk";
    } else {
      prognosis["Standing"] = "seek medical attention";
    }

    var age;
    var htn;

    // compute age and hypertension
    if (birthDate) {
      var ageDifMs = Date.now() - new Date(birthDate).getTime();
      var ageDate = new Date(ageDifMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    if (recentObservations["8462-4"].recent) {
      htn = recentObservations["8462-4"].recent[1] >= 80 ? 1 : 0;
    }

    // determine if there are enough observations to use one of the models
    if (
      age &&
      recentObservations["2160-0"].recent &&
      recentObservations["8462-4"].recent &&
      recentObservations["2965-2"].recent &&
      recentObservations["30003-8"].recent &&
      recentObservations["2350-7"].recent &&
      recentObservations["32546-4"].recent &&
      recentObservations["21525-1"].recent &&
      recentObservations["30350-3"].recent
    ) {
      console.log("Full Model");

      var obsArr = [
        parseFloat(age),
        parseFloat(recentObservations["8462-4"].recent[1]), // bp
        parseFloat(recentObservations["2965-2"].recent[1]), // sg
        parseFloat(recentObservations["30003-8"].recent[1]), // al
        parseFloat(recentObservations["2350-7"].recent[1]), // su
        parseFloat(recentObservations["32546-4"].recent[1]), // bgr
        parseFloat(recentObservations["2160-0"].recent[1]), // sc
        parseFloat(recentObservations["21525-1"].recent[1]), // sod
        parseFloat(recentObservations["30350-3"].recent[1]), // hemo
        parseFloat(htn),
      ]; // htn

      console.log(obsArr);

      var ckd = prognosisModel.getPrognosis(obsArr);
      prognosis["Model"] = parseInt(ckd);
      prognosis["ModelScore"] = parseInt(ckd);
    } else if (
      age &&
      recentObservations["2160-0"].recent &&
      recentObservations["8462-4"].recent &&
      recentObservations["2965-2"].recent
    ) {
      console.log("Simple Model");

      var obsArr = [
        parseFloat(age),
        parseFloat(recentObservations["8462-4"].recent[1]), // bp
        parseFloat(recentObservations["2965-2"].recent[1]), // sg
        parseFloat(recentObservations["2160-0"].recent[1]), // sc
        parseFloat(htn),
      ]; // htn

      console.log(obsArr);

      var ckd = prognosisModel.getSimplePrognosis(obsArr);
      console.log(ckd);
      prognosis["SimpleModel"] = parseInt(ckd);
      prognosis["ModelScore"] = parseInt(ckd);
    } else {
      console.log("Not enough Data for ML Model");
    }

    return prognosis;
  },
};
