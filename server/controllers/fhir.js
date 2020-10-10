codes = [
  ["55284-4", "8480-6"], // BP systolic
  ["55284-4", "8462-4"], // BP disys
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
    return observations
      ? observations.map((obj) => {
          //console.log(obj);
          return obj;
          return {
            id: obj.resource.id,
            //   name: `${obj.resource.name[0].given} ${obj.resource.name[0].family}`,
            //   gender: obj.resource.gender,
            //   birthDate: obj.resource.birthDate,
            //   imageURL: "",
          };
        })
      : [];
  },
  getMapping: function (observationCode) {
    return observationMapping[observationCode];
  },
};
