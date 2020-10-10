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
    filtered_observations = {
      "2160-0": {
        name: "Creatinine [Mass/Vol]",
        data: [],
      },
      "48642-3": {
        name: "GFR/BSA pr.non blk SerPlBld MDRD-ArV",
        data: [],
      },
      "8480-6": {
        name: "Systolic blood pressure",
        data: [],
      },
      "8462-4": {
        name: "Diastolic blood pressure",
        data: [],
      },
      "21482-5": {
        name: "Protein (24H U) [Mass/Vol]",
        data: [],
      },
    };

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

    return filtered_observations;
  },
  getMapping: function (observationCode) {
    return observationMapping[observationCode];
  },
  getPrognosis: function (recentObservations) {
    return {
      RiskFactor: 50,
      Standing: "Good",
      Percentile: "71%",
    };
  },
};
