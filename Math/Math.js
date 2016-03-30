module.exports = {}  


function createData(theirParams,classParams,ranges){
	var result = [];
	//Where X is input 
	var temperature = theirParams[0];
	var concentration = theirParams[1];
	var feed_rate = theirParams[2];
	var pressure = theirParams[3];
	var time = theirParams[4];

	result.push(-Number.MAX_SAFE_INTEGER); // vba 1 based arrays so add empty to keep consistency.
	result.push(	(temperature - midPoint("Temperature", ranges)) / HalfRange("Temperature",ranges));
	result.push(	(concentration - midPoint("Concentration", ranges)) / HalfRange("Concentration",ranges));
	result.push(	(feed_rate - midPoint("Feed rate", ranges)) / HalfRange("Feed rate",ranges));
	result.push(	(pressure - midPoint("Pressure", ranges)) / HalfRange("Pressure",ranges));
	result.push(	(time - midPoint("Time", ranges)) / HalfRange("Time",ranges));
	return result;
}

function calcYield(X,classParams){

	var Primary = findFromName("Primary",classParams);
	var Secondary = findFromName("Secondary",classParams);
	var LeftRight =  getLeftRight(classParams);
	var UpDown =  getUpDown(classParams);
	var YieldMax = findFromName("Yield Max",classParams);
	var SmallPeak = findFromName('Small Peak',classParams);
	var Steepness = findFromName('Steepness',classParams);
	var Sneaky = findFromName('Sneaky',classParams);
	var SneakyMax = findFromName('Sneaky Max',classParams);
	var SneakyPercent = findFromName('Sneaky Percent',classParams);


	var answer = ((Math.sin(Math.PI * X[Primary] ) * X[Primary] + Math.cos(X[Primary]) * Math.sin(X[Primary]) * -1) * 
		(YieldMax - SmallPeak)) + ( Math.pow((X[Secondary] * -UpDown),3) - 
    	Math.pow(((X[Secondary] * -UpDown) + 0.5),2) * (100 - Steepness)) + SmallPeak;

	if(Sneaky > 0){

        if(SneakyPercent != 0)  {
        	SneakyBoost = YieldMax * (SneakyPercent / 100)
        }
        if(LeftRight > 0){
                PrimarySneakMin = 0.5
                PrimarySneakMax = 0.75
        }
        else {
                PrimarySneakMin = -0.75
                PrimarySneakMax = -0.5
        }
        if( UpDown > 0 ){
                SecondarySneakMin = 0.5
                SecondarySneakMax = 0.75
        }
        else {
                SecondarySneakMin = -0.75
                SecondarySneakMax = -0.5
        }

        SneakyBoost = 0
		if(X[Primary] >= PrimarySneakMin && X[Primary] <= PrimarySneakMax){
			if(X[Secondary] >= SecondarySneakMin && X[Secondary] <= SecondarySneakMax){
	    		var SneakyValue = ((Math.pow(X[Sneaky] - SneakyMax),2)) * -SneakyBoost + SneakyBoost
	    		console.log(SneakyValue)
	    		answer = answer + SneakyValue
    		}
    	}
	}
    return answer;
}


function calcViscosity(X,classParams){
	var ThirdVariable = findFromName("Third Variable", classParams);
	var Skew = findFromName("Skew", classParams);
	var Position = findFromName("Position", classParams);
	var Shape = findFromName("Shape", classParams);
	var ViscosityMax = findFromName("Viscosity Max", classParams);
	var singleVar = findFromName("Single Variable", classParams);
	var dualVar = findFromName("Dual Variable", classParams);
	var ViscosityInfluence = findFromName("Viscosity Influence", classParams);
	var Magnitude = 0.8 * ViscosityMax
	var Primary = findFromName("Primary",classParams);
	var LeftRight =  getLeftRight(classParams);//findFromName("Upper Left",classParams) | findFromName("Lower Left",classParams);
	var UpDown = getUpDown(classParams);

    if( ViscosityInfluence == Primary)
        PowerAdjust = LeftRight
    else
        PowerAdjust = UpDown

	if(singleVar){
		var sinus = findFromName("Sinusoid", classParams);
		var gentle = findFromName("Gentle Max", classParams);
		var wiggly = findFromName("Wiggly", classParams);

		var Power1;
		var Power2;
		var Power3;
		var Power4;

		if(sinus){
                Power1 = 4;
                Power2 = 2 - PowerAdjust;
                Power3 = 2;
                Power4 = 2 + PowerAdjust;
        }
        else if(gentle){
                Power1 = 4;
                Power2 = 2 - PowerAdjust;
                Power3 = 1;
                Power4 = 2 + PowerAdjust;
        }
  		else if(wiggly){
                Power1 = 4;
                Power2 = 4 - PowerAdjust;
                Power3 = 2;
                Power4 = 4 + PowerAdjust;
        } 

        var ThirdVariable = 0;

        var answer = -100 * (Math.pow((X[ViscosityInfluence]), Power1)) + 275 *
                	(Math.pow(X[ViscosityInfluence],Power2)) + 100 * (Math.pow(X[ViscosityInfluence],Power3)) - 
                	300 * (Math.pow(X[ViscosityInfluence],Power4))  + Magnitude;
 	} else if (dualVar){
        var answer = ((-1 * ( Math.pow((X[ThirdVariable] - Skew),Shape)) + 1) - 
                Math.sin(-1 * ((X[ViscosityInfluence] + Position) / 0.3)) * -1 * PowerAdjust) * Magnitude;
  	}

	return answer;
}



function calcMolecularWeight(X,classParams){
	var MoleInfluence = findFromName("Mole Influence", classParams);
	var MoleMax = findFromName("Mole Max", classParams);
	var MoleMin = findFromName("Mole Min", classParams);
	var Adjust = findFromName("Adjust", classParams);
	var Primary = findFromName("Primary",classParams);
	var Secondary = findFromName("Secondary",classParams);
	var LeftRight = getLeftRight(classParams);
	var UpDown = getUpDown(classParams);

    if (MoleInfluence == Primary){
        PlusMinus = LeftRight
        Adjust = Math.abs(Adjust)
    }
    else if( MoleInfluence == Secondary){
        PlusMinus = UpDown
        Adjust = Math.abs(Adjust)
    }
    else {
        PlusMinus = 1
    }

	var molecularnumber = (Math.pow((X[MoleInfluence] - (Adjust * PlusMinus)),2)) * 
        	(-1 * (MoleMax - MoleMin) / 2) + MoleMax;


	return molecularnumber;
}


module.exports.mainFunction = function(theirParams, classParams, classInputRanges){
	//Temp, Concentration, Feed Rate, Pressure, Time. Could add name tags like functionParams if it helps.

    // console.log(theirParams)
    // console.log(classParams)
    // console.log(classInputRanges)

	var X = createData(theirParams,classParams,classInputRanges);

	var moleWeight = calcMolecularWeight(X,classParams);
	var visc =  calcViscosity(X,classParams);
	var yield =  calcYield(X,classParams);


	var NoiseVariable = findFromName("Noise Variable", classParams);
	var NoiseLevel = findFromName("NoiseLevel", classParams);
	var NoiseMin = findFromName("Noise Min", classParams);
	var YieldMax = findFromName("Yield Max",classParams);
	var MoleMax = findFromName("Mole Max", classParams);
	var ViscosityMax = findFromName("Viscosity Max", classParams);

	var rand = Math.random() + Math.random();

    var YieldNoiseLevel = YieldMax * (NoiseLevel / 100)
    var ViscosityNoiseLevel = ViscosityMax * (NoiseLevel / 100)
    var MoleNoiseLevel = MoleMax * (NoiseLevel / 100)

	if(NoiseVariable > 0){
        VariableNoise = Math.abs(X[NoiseVariable] - NoiseMin) + 1;
    }

    var YieldNoise = (rand - 1) * YieldNoiseLevel * VariableNoise
    var ViscosityNoise = (rand - 1) * ViscosityNoiseLevel * VariableNoise
    var MoleNoise = (rand - 1) * MoleNoiseLevel * VariableNoise


    if(yield < 0) yield = 0
    if(visc < 0) visc = 0
    if(moleWeight < 0) moleWeight = 0

    yield+= YieldNoise
    visc+= ViscosityNoise
    moleWeight+= MoleNoise

    yield = parseFloat(yield).toFixed(3);
    visc = parseFloat(visc).toFixed(3);
    moleWeight = parseFloat(moleWeight).toFixed(3);


  //Make return look like this; name is name of return i.e. yield, value is the numerical value.
  return [{name:"Yield", value: yield}, {name:"Viscosity", value:visc},{name:"Molecular Weight", value: moleWeight}];
}

/**
	UTLITY FUNCTIONS
*/
var midPoint = function(name, params){
	return (findMin(name,params) + findMax(name,params)) / 2;
}

var HalfRange = function(name, params){
	return (findMax(name,params) - findMin(name,params)) / 2;
}

var findFromName = function(name,params){
	for (var i = 0; i < params.length; i++) {
		if(params[i].name == name) {
            if(typeof params[i].value == "boolean") return params[i].value;
            return parseFloat(params[i].value);
        };
	};
}

var findMin = function(name,params){
	for (var i = 0; i < params.length; i++) {
		if(params[i].name == name) return parseFloat(params[i].range[0]);
	};
}

var findMax = function(name,params){
	for (var i = 0; i < params.length; i++) {
		if(params[i].name == name) return parseFloat(params[i].range[1]);
	};
}

var getLeftRight = function(classParams){
    if(findFromName("Upper Left", classParams) == 1)
        return -1
    if(findFromName("Lower Left", classParams) == 1)
        return -1
    if(findFromName("Upper Right", classParams) == 1)
        return 1
    if(findFromName("Lower Right", classParams) == 1)
        return 1
}

var getUpDown = function(classParams){
    if(findFromName("Upper Left", classParams) == 1)
        return 1
    if(findFromName("Lower Left", classParams) == 1)
        return -1
    if(findFromName("Upper Right", classParams) == 1)
        return 1
    if(findFromName("Lower Right", classParams) == 1)
        return -1
}
