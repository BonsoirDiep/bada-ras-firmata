var firebase = require('firebase');
var SerialPort = require('serialport');

var Board = require("firmata");
var board; // main control

var config = require("./config.json");
var productKey = config.productKey; // note: 'hFrPLqQKIbmU' is demo product key
if(!productKey) productKey = config.demoKey;
/**
 * initializeApp with badaiots-kz.firebaseapp.com
 */
var app = firebase.initializeApp({
    apiKey: "AIzaSyAQjPEurq2EePfkHTwlcV-2z9DUfDo0V6c",
    authDomain: "badaiots-kz.firebaseapp.com",
    databaseURL: "https://badaiots-kz.firebaseio.com",
    projectId: "badaiots-kz",
    storageBucket: "badaiots-kz.appspot.com",
    messagingSenderId: "557393741006"
});
var db = firebase.database();
var a = db.ref('product/'+productKey+'/kit');
var delayMs = 2000;
var listSensors = []; // update each delayMs ms
var listOnes = []; // update each delayMs ms
var listLights = []; // listen data event
var listAnalogs = []; // listen data event
/**
 * analog Design Firmata
 */
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
var removeAnalogs = [];

var unoReady = false;

SerialPort.list(function(error_serial, result) {
  if(error_serial) return console.log('Error get list ports: ', err.message);
  console.log('Running: get list ports...');
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
  board = new Board(ports[0], {samplingInterval: 1200});

  board.on("ready", function() {
    // board.pinMode(13, board.MODES.OUTPUT);
	// board.digitalWrite(13, 1); // state^=1
	//console.log(board.analogPins);
    unoReady = true;
	console.log('READY!!!');
	actionHere();
	setInterval(function(){
		removeAnalogs.forEach(e=>{
			try{
				board.reportAnalogPin(ePin[e], 0);
				console.log(ePin[e]);
			}
			catch (err){
				console.log(err.message);
			}
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
				db.ref("product/"+productKey+"/sens").update(json);
			}
		});
		listOnes.forEach(e=>{
			var pin = parseInt(e);
			board.sendOneWireConfig(pin, true);
			board.sendOneWireSearch(pin, function(error, devices) {
				if(error) {
					console.log(error.message);
					return;
				}
				var device = devices[0];
				// start transmission
				board.sendOneWireReset(pin);
				// a 1-wire select is done by ConfigurableFirmata
				board.sendOneWireWrite(pin, device, 0x44);
				// the delay gives the sensor time to do the calculation
				board.sendOneWireDelay(pin, 1000);
				// start transmission
				board.sendOneWireReset(pin);
				// tell the sensor we want the result and read it from the scratchpad
				board.sendOneWireWriteAndRead(pin, device, 0xBE, 9, function(err, data) {
					if(err) {
					  return;
					}
					var raw = (data[1] << 8) | data[0];
					var celsius = raw / 16.0;
					var a = parseFloat(celsius);
					if(!isNaN(a) && a>0){
						var json ={};
						json['node'+e] = a;
						console.log(json);
						db.ref("product/"+productKey+"/sens").update(json);
					}
				});
			});
		})
	}, 1200);
  });
});

function fcOnOff(pin, val){
    if(!unoReady) return;
    board.pinMode(pin, board.MODES.OUTPUT);
	board.digitalWrite(pin, val);
}
function fcDimmer(pin, val){
    if(!unoReady) return;
    board.pinMode(pin, board.MODES.PWM);
	board.analogWrite(pin, val);
	//board.pwmWrite(pin, val);
}
function isONOFF(n){
    var pins = [ 2, 4, 7, 8, 12, 13];
    if(typeof(n)=='number'){
        return (pins.indexOf(n) >-1);
    } else if(typeof(n)=='string'){
        var b = parseInt(n);
        if(b.toString() === n) return (pins.indexOf(b) >-1);
    }
    
    return false;
}
function isOneWire(n){
    var pins = [ 2, 4];
    if(typeof(n)=='number'){
        return (pins.indexOf(n) >-1);
    } else if(typeof(n)=='string'){
        var b = parseInt(n);
        if(b.toString() === n) return (pins.indexOf(b) >-1);
    }
    
    return false;
}
function isPWM(n){
    var pins = [3, 5, 6, 9, 10, 11];
    if(typeof(n)=='number'){
        return (pins.indexOf(n) >-1);
    } else if(typeof(n)=='string'){
        var b = parseInt(n);
        if(b.toString() === n) return (pins.indexOf(b) >-1);
    }
    
    return false;
}
function isSENSOR(n){
    var pins = [ 14,15,16,17,18,19];
    if(typeof(n)=='number'){
        return (pins.indexOf(n) >-1);
    } else if(typeof(n)=='string'){
        var b = parseInt(n);
        if(b.toString() === n) return (pins.indexOf(b) >-1);
    }
    
    return false;
}
// init user design
var actionHere = function(){
a.on("child_added", function(snapshot, prevChildKey) {
    var b = snapshot.key;
    var c = snapshot.val();
    
    if(b == 'lights'){
        if(c!=null) c.split(';').forEach(e=>{
            if(e) listLights.push('node'+e);
        })
    } else if(b == 'analogs'){
        if(c!=null) c.split(';').forEach(e=>{
            if(e) listAnalogs.push('node'+e);
        })
    } else if(b == 'sens'){
        if(c!=null) c.split(';').forEach(e=>{
            if(e && isSENSOR(e)) listSensors.push(e);
        });
    } else if(b == 'one'){
		if(c!=null) c.split(';').forEach(e=>{
            if(e && isOneWire(e)) listOnes.push(e);
        })
	}
});
// user rebuild designs
a.on("child_removed", function(snapshot, prevChildKey) {
    var b = snapshot.key;
    var c = snapshot.val();
    if(b == 'lights'){
        if(c!=null) c.split(';').forEach(e=>{
            if(e){
				var hack = listLights.indexOf('node'+e);
				if(hack>=0) listLights.splice(hack,1);
			}
        })
    } else if(b == 'analogs'){
        if(c!=null) c.split(';').forEach(e=>{
            if(e) {
				var hack = listAnalogs.indexOf('node'+e);
				if(hack>=0) listAnalogs.splice(hack,1);
				if(removeAnalogs.indexOf(e)<0) removeAnalogs.push(e);
			}
        })
    } else if(b == 'sens'){
        if(c!=null) c.split(';').forEach(e=>{
            if(e){
				var hack = listSensors.indexOf(e);
				if(hack>=0) listSensors.splice(hack,1);
			}
        })
    } else if(b == 'one'){
        if(c!=null) c.split(';').forEach(e=>{
            if(e){
				var hack = listOnes.indexOf(e);
				if(hack>=0) listOnes.splice(hack,1);
			}
        })
    }
});

// analog and digital output change
a.on("child_changed", function(snapshot, prevChildKey) {
    var b = snapshot.key;
    if(b.startsWith('node')){
        var c = snapshot.val();
        if(listAnalogs.indexOf(b)>-1 && c!=null){
            b = b.replace('node','');
            if(isPWM(b)){
                c = parseInt(c);
                if(!isNaN(c)&& 0<=c && c<= 255){
					fcDimmer(b,c);
                }
            }
        }
        else if(listLights.indexOf(b)>-1){
            b = b.replace('node','');
            if(isONOFF(b)){
				if(c) fcOnOff(b, 1); else fcOnOff(b, 0);
            }
        }
        //thao tác xuất giá trị ra chân GPIO
    }
});
}