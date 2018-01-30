var SerialPort = require('serialport');
var Board = require("firmata");

var board;
var removeAnalogs = [];
var listSensors = [];
var ePin = {
	'14': 0,
	'15': 1,
	'16': 2,
	'17': 3,
	'18': 4,
	'19': 5
};
var reportAnalogs = {
	'14': 0,
	'15': 0,
	'16': 0,
	'17': 0,
	'18': 0,
	'19': 0
}
var gg = 0;
SerialPort.list(function(error_serial, result) {
  if(error_serial) return console.log('Error get list ports: ', err.message);
  console.log('Running: get list ports...');
  if(result.length<1) {
	  console.log('No device connect...');
	  process.exit();
  }
  var ports = result.filter(function(val) {
	var available = true;
	// ttyUSB#, cu.usbmodem#, COM#
	var rport = /usb|acm|^com/i;
	if (!rport.test(val.comName)) {
		available = false;
	}
	return available;
  }).map(function(val) {
	return val.comName;
  });
  console.log('###########');
  console.log(result);
  console.log('###########');
  board = new Board(ports[0], {samplingInterval: 900});

  board.on("ready", function() {
	console.log('READY!!!');
	setInterval(function(){
		console.log('removeAnalogs: ', removeAnalogs);
		console.log('listSensors: ', listSensors);
		removeAnalogs.forEach(e=>{
			board.reportAnalogPin(ePin[e], 0);
			var hack = removeAnalogs.indexOf(e);
			if(hack>=0){
				removeAnalogs.splice(hack,1);
				reportAnalogs[e] = 0;
			}
		});
		listSensors.forEach(e=>{
			board.pinMode(ePin[e], board.MODES.ANALOG);
			if(!reportAnalogs[e]){
				reportAnalogs[e] = !0;
				board.analogRead(ePin[e],()=>{});
			} else{
				var data = board.pins[board.analogPins[ePin[e]]].value;
				var a = parseFloat(data);
				var mV = a * 5.0 * 1000 / 1023.0;
				var tmpC = Math.round(mV / 10);
				var json ={};
				json['node'+e] = tmpC;
				console.log(json);
			}
			gg+=1;
			if(gg==5)
			{
				listSensors.pop();
				removeAnalogs.push(14);
				listSensors.push(15);
			}
			if(gg==10){
				listSensors.pop();
				removeAnalogs.push(15);
			}
		});
	}, 1200);
  });
});

listSensors.push(14);