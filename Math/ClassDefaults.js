
module.exports = {}  

module.exports.defaultParams = [
  {"name":"Primary", "value": 1},
  {"name":"Secondary", "value": 2},
  {"name":"NoiseLevel", "value": 3},
  {"name":"Noise Variable", "value": 3},
  {"name":"Noise Min", "value": 0},
  {"name":"Upper Left", "value": 0},
  {"name":"Lower Left", "value": 1},
  {"name":"Upper Right", "value": 0},
  {"name":"Lower Right", "value": 0},
  {"name":"Steepness", "value": 70},
  {"name":"Small Peak", "value": 100},
  {"name":"Yield Max", "value": 150},


  {"name":"Viscosity Influence", "value": 1},


  {"name":"Viscosity Max", "value": 500},
  {"name":"Single Variable", "value": true},
  {"name":"Dual Variable", "value": false},
  {"name":"Sinusoid", "value": 0},
  {"name":"Gentle Max", "value": 0},
  {"name":"Wiggly", "value": 1},
  {"name":"Third Variable", "value": 3},
  {"name":"Shape", "value": 2},
  {"name":"Skew", "value": 0},
  {"name":"Position", "value": 1},
  {"name":"Mole Influence", "value": 2},
  {"name":"Adjust", "value": -.5},
  {"name":"Mole Max", "value": 500},
  {"name":"Mole Min", "value": 200},
  {"name":"Sneaky", "value": 5},
  {"name":"Sneaky Percent", "value":  10},
  {"name":"Sneaky Max", "value": .5}

];

module.exports.defaultInput = [
  {"name":"Temperature", "range":[200,450], "units":"deg" },
  {"name":"Concentration", "range":[100,500],  "units":"g/l"}, 
  {"name":"Feed rate", "range":[200,600],  "units":"g/m"},
  {"name":"Pressure", "range":[140,200], "units":"psi" },
  {"name":"Time", "range":[15,45],  "units":"mins"}
];