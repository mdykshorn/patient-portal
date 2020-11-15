codes = [
  "8480-6", // BP systolic
  "8462-4", // BP disys
  "2160-0", // SCR
  "48642-3", //GFR
  "21482-5", // 24hour protein in urine
];

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
    var filtered_observations = {
      "2160-0": {
        name: "Creatinine [Mass/Vol]",
        data: [],
        units: "mg/dL",
        shortName: "Creatinine",
        description: "Level of Serum Creatinine",
      },
      "48642-3": {
        name: "GFR/BSA pr.non blk SerPlBld MDRD-ArV",
        data: [],
        units: "mL/min/{1.73_m2}",
        shortName: "GFR",
        description: "Kidney Function",
      },
      "8480-6": {
        name: "Systolic blood pressure",
        data: [],
        units: "mm[Hg]",
        shortName: "Systolic blood pressure",
        description: "Systolic blood pressure",
      },
      "8462-4": {
        name: "Diastolic blood pressure",
        data: [],
        units: "mm[Hg]",
        shortName: "Diastolic blood pressure",
        description: "Diastolic blood pressure",
      },
      "21482-5": {
        name: "Protein (24H U) [Mass/Vol]",
        data: [],
        units: "mg/24hour",
        shortName: "Protienuria",
        description: "Protein in Urine",
      },
    };

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
  getPrognosis: function (recentObservations) {
    var prognosis = {
      RiskFactor: 0,
      Standing: "no records",
      Percentile: "no records",
    };

    var overalProg = 0;

    if (recentObservations["2160-0"].recent) {
      var val = recentObservations["2160-0"].recent[1];

      if (val > 1.68) {
        prognosis["Percentile"] = 71;
        overalProg += 10;
      } else if (val > 1.26) {
        prognosis["Percentile"] = 26;
        overalProg += 5;
      } else {
        prognosis["Percentile"] = 2.5;
      }
    }
    if (recentObservations["48642-3"].recent) {
      var val = recentObservations["48642-3"].recent[1];
      if (val < 60) {
        overalProg += 20;
      }
    }
    if (recentObservations["8480-6"].recent) {
      var val = recentObservations["8480-6"].recent[1];
      if (val > 140) {
        overalProg += 10;
      }
    }
    if (recentObservations["8462-4"].recent) {
      var val = recentObservations["8462-4"].recent[1];
      if (val > 90) {
        overalProg += 10;
      }
    }
    if (recentObservations["21482-5"].recent) {
      var val = recentObservations["21482-5"].recent[1];
      if (val > 1000) {
        overalProg += 10;
      } else if (val > 3500) {
        overalProg += 30;
      }
    }

    prognosis["RiskFactor"] = overalProg;

    if (overalProg < 20) {
      prognosis["Standing"] = "good";
    } else if (overalProg < 40) {
      prognosis["Standing"] = "at risk";
    } else {
      prognosis["Standing"] = "seek medical attention";
    }

    return prognosis;
  },
};
