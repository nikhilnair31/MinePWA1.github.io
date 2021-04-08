//Event listeners to check for connection status changes
window.addEventListener('offline', handleConnection);
window.addEventListener('online', handleConnection);

//intial var stuff
var onlineStatus = true;
var dbObj = {
	"Calculations" : {
		"Incombustible Matter" : {
			"-" : 0
		},
		"Stone Dust Quantities" : {
			"-" : 0
		}
	},
	"Historical Data" : {
		"Fire Levels" : {
			"Graham's Ratio" : {
				"-MRTpVwT5x_ZU4NdfYZP" : {
					"gr_value" : 0.8,
					"safety_status" : "0.8\nNormal",
					"time_stamp" : 1611130082
				},
				"-MRYOBT6bzPJH63ro6rc" : {
					"gr_value" : 1,
					"safety_status" : "1.0\nNormal",
					"time_stamp" : 1611206544
				},
				"-MRYPUQxPzLdu82smUsJ" : {
					"gr_value" : -3.4,
					"safety_status" : "-3.4\nSafe",
					"time_stamp" : 1611206883
				},
				"-MRYPzz3UNR5Rtz7Ikp4" : {
					"gr_value" : 7.2,
					"safety_status" : "7.2\nActive Fire",
					"time_stamp" : 1611207017
				},
				"-MRYQSklzo5OwL24qXaQ" : {
					"gr_value" : 8.5,
					"safety_status" : "8.5\nActive Fire",
					"time_stamp" : 1611207139
				},
				"-MRYRCjX00KpeCH0fbvJ" : {
					"gr_value" : -53.4,
					"safety_status" : "-53.4\nSafe",
					"time_stamp" : 1611207335
				},
				"-MRYRaGJI9qlalbtQDTq" : {
					"gr_value" : -0.4,
					"safety_status" : "-0.4\nSafe",
					"time_stamp" : 1611207436
				},
				"-MRYd6AHTGqmRXLbTOL4" : {
					"gr_value" : 6,
					"safety_status" : "6.0\r\nActive Fire",
					"time_stamp" : 1611210716
				},
				"-MRYeJh4iVAZ7VYMhSkE" : {
					"gr_value" : 5.2,
					"safety_status" : "\r\nActive Fire",
					"time_stamp" : 1611211034
				},
				"-MRZ0LDDkA3hIjKz9xMu" : {
					"gr_value" : 2.1,
					"safety_status" : "\r\nAdvance Heating Approaching Active Fire",
					"time_stamp" : 1611217069
				}
			}
		},
		"Gas Levels" : {
			"CO" : {
				"-MRUMAOQ66Izw15lL1kG" : {
					"gas_conc" : 163287,
					"gas_unit" : "ppm",
					"safety_status" : "Fatal",
					"time_stamp" : 1611138906
				},
				"-MRUZ1YkrEKuDQgraqsy" : {
					"gas_conc" : 200,
					"gas_unit" : "%",
					"safety_status" : "severe headaches in 1 hour",
					"time_stamp" : 1611142278
				},
				"-MRUZ2d0v4gwn-H7x2ga" : {
					"gas_conc" : 1680,
					"gas_unit" : "%",
					"safety_status" : "tachycardia and death in 2 hours",
					"time_stamp" : 1611142283
				},
				"-MRVkMVoiBmG0KPs9km8" : {
					"gas_conc" : 61384,
					"gas_unit" : "ppm",
					"safety_status" : "Fatal",
					"time_stamp" : 1611162286
				},
				"-MRYNCf9D3dilSziSgTc" : {
					"gas_conc" : 136,
					"gas_unit" : "%",
					"safety_status" : "severe headaches in 1 hour",
					"time_stamp" : 1611206286
				},
				"-MRYPJOMzXqeMKq3GmWZ" : {
					"gas_conc" : 320,
					"gas_unit" : "%",
					"safety_status" : "severe headaches in 1 hour",
					"time_stamp" : 1611206838
				},
				"-MRsWQpekGGCiYerK6EE" : {
					"gas_conc" : 51236,
					"gas_unit" : "ppm",
					"safety_status" : "???",
					"time_stamp" : 1611561026
				}
			},
			"CO2" : {
				"-MRUKh79G63o__10Wza2" : {
					"gas_conc" : 132840,
					"gas_unit" : "ppm",
					"safety_status" : "sudden unconsciousness and death",
					"time_stamp" : 1611138520
				},
				"-MRUNjkr-jgVIyCVJUzo" : {
					"gas_conc" : 13526,
					"gas_unit" : "ppm",
					"safety_status" : "increased respiration and headaches",
					"time_stamp" : 1611139318
				},
				"-MRUWjjXDuG2Rie0XVLb" : {
					"gas_conc" : 23652,
					"gas_unit" : "ppm",
					"safety_status" : "increased respiration and headaches",
					"time_stamp" : 1611141677
				},
				"-MRUWm9gAJESZ8HVuQ8u" : {
					"gas_conc" : 43256,
					"gas_unit" : "ppm",
					"safety_status" : "nausea and unconsciousness",
					"time_stamp" : 1611141687
				},
				"-MRUWnSsl93kEd0BFsbD" : {
					"gas_conc" : 1295,
					"gas_unit" : "ppm",
					"safety_status" : "average exposure for 8 hours",
					"time_stamp" : 1611141692
				},
				"-MRUYQs30ocMl0r6W3wK" : {
					"gas_conc" : 13625,
					"gas_unit" : "ppm",
					"safety_status" : "increased respiration and headaches",
					"time_stamp" : 1611142120
				},
				"-MRUYS8aYPSAfMl97j2d" : {
					"gas_conc" : 45268,
					"gas_unit" : "ppm",
					"safety_status" : "nausea and unconsciousness",
					"time_stamp" : 1611142125
				},
				"-MRYMRcictpFqdirrgA-" : {
					"gas_conc" : 13285,
					"gas_unit" : "ppm",
					"safety_status" : "increased respiration and headaches",
					"time_stamp" : 1611206085
				}
			}
		},
		"Noise Levels" : {
			"Ambient Noise Levels" : {
				"-MRTwhzPMfhWb_xlNef4" : {
					"area_name" : "Silence Zone",
					"day_time" : "Night Time",
					"loudness" : 69,
					"safety_status" : "UnSafe",
					"time_stamp" : 1611131970
				},
				"-MRYNppQv3LuzTj04Gxf" : {
					"area_name" : "Industrial Area",
					"day_time" : "Day Time",
					"loudness" : 93,
					"safety_status" : "UnSafe",
					"time_stamp" : 1611206451
				},
				"-MRYPNEc-9xwwLffWmEY" : {
					"area_name" : "Industrial Area",
					"day_time" : "Day Time",
					"loudness" : 99,
					"safety_status" : "UnSafe",
					"time_stamp" : 1611206854
				}
			},
			"OSHA" : {
				"-MRTojzFJyWQ4jBVyvBw" : {
					"loudness" : 111,
					"safety_status" : "UnSafe after 0.25 hours",
					"time_stamp" : 1611129881
				},
				"-MRYNu1JMV11HjZODzQY" : {
					"loudness" : 111,
					"safety_status" : "UnSafe after 0.25 hours",
					"time_stamp" : 1611206468
				},
				"-MRYPQ9mHDZECAdO5Hql" : {
					"loudness" : 130,
					"safety_status" : "Completely UnSafe",
					"time_stamp" : 1611206866
				}
			}
		}
	},
	"Threshold Levels" : {
		"Fire Levels" : {
			"Graham's Ratio" : {
				"Active Fire" : 3,
				"Advance Heating Approaching Active Fire" : 2,
				"Existance of Spontaneous Heating" : 1,
				"Normal" : 0.5
			}
		},
		"Gas Levels" : {
			"CO" : {
				"ppm" : {
					"0" : "safe",
					"6" : "average exposure of 24 hours",
					"9" : "average exposure of 8 hours",
					"35" : "headache and dizziness in 8 hours",
					"100" : "headache in 2 hours",
					"400" : "severe headaches in 1 hour",
					"800" : "nausea and convulsions in 45 minutes",
					"3200" : "tachycardia and death in 2 hours",
					"6400" : "convulsions and respiratory arrest with death in 20 minutes",
					"12800" : "unconsciousness in 2-3 breathes with death in 3 minutes"
				}
			},
			"CO2" : {
				"ppm" : {
					"350" : "normal athmosphere",
					"600" : "indoor levels",
					"1000" : "tolerable",
					"5000" : "average exposure for 8 hours",
					"10000" : "short exposures only",
					"30000" : "increased respiration and headaches",
					"100000" : "nausea and unconsciousness",
					"200000" : "sudden unconsciousness and death"
				}
			}
		},
		"Noise Levels" : {
			"Ambient Noise Levels" : {
				"Day Time" : {
					"Commercial Area" : 65,
					"Industrial Area" : 75,
					"Residential Area" : 55,
					"Silence Zone" : 50
				},
				"Night Time" : {
					"Commercial Area" : 55,
					"Industrial Area" : 65,
					"Residential Area" : 45,
					"Silence Zone" : 45
				}
			},
			"OSHA" : {
				"90" : 8,
				"92" : 6,
				"95" : 4,
				"97" : 3,
				"100" : 2,
				"102" : 1.5,
				"105" : 1,
				"107" : 0.75,
				"110" : 0.5,
				"115" : 0.25
			}
		}
	}
};
var conn_status_icon = document.getElementById("conn_icon");

//intial check for connection by getting conn status ref and show online or offline status, and if online then save a copy of the json and overwrite dbObj
//flip status to have localStorage running while connected during debug times
if(window.navigator.onLine){
	onlineStatus = true;//false
	conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#8ad6cc 0px 0px 0px) saturate(1000%)");
	conn_status_icon.src = "../images/wifi_conn.png";
	$.getJSON('https://minedb31.firebaseio.com/.json', function(data) {
		dbObj = data;
		localStorage.setItem('dbObj', JSON.stringify(dbObj));
		debugLogPrint(['db', dbObj]);
	});
}
else{
	onlineStatus = false;//true
	conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#f98b8b 0px 0px 0px) saturate(1000%)");
	conn_status_icon.src = "../images/wifi_disconn.png";
}

//check if geolocation is a supported option
// if(navigator.geolocation) {
// 	navigator.geolocation.getCurrentPosition(function(position) {
// 		var positionInfo = "Latitude: " + position.coords.latitude + "- " + "Longitude: " + position.coords.longitude;
// 		debugLogPrint(['geolocation positionInfo', positionInfo]);
// 	});
// } 
// else {
// 	alert("Sorry, your browser does not support HTML5 geolocation.");
// }

function handleConnection() {
	if (navigator.onLine) {
		isReachable(window.location.origin).then(function(online) {
			connStatusSwitch(online);
		});
	} 
	else {
		connStatusSwitch(false);
	}
}

function isReachable(url) {
	return fetch(url, { method: 'HEAD', mode: 'no-cors' })
	.then(function(resp) {
		return resp && (resp.ok || resp.type === 'opaque');
	})
	.catch(function(err) {
		console.warn('[conn test failure]:', err);
	});
}

//if status changed from online->offline or vice versa
function connStatusSwitch(isOnline) {
	//changed from offline->online
	if (isOnline) {
		onlineStatus = false;//true
		conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#8ad6cc 0px 0px 0px) saturate(1000%)");
		conn_status_icon.src = "../images/wifi_conn.png";
		
		db_ref.child("Historical Data").set(dbObj['Historical Data']);
		debugLogPrint(['connStatusSwitch online', dbObj['Historical Data']]);
	} 
	//changed from online->offline
	else {
		onlineStatus = true;//false
		conn_status_icon.style.setProperty("-webkit-filter", "opacity(0.5) drop-shadow(#f98b8b 0px 0px 0px) saturate(1000%)");
		conn_status_icon.src = "../images/wifi_disconn.png";

		$.getJSON('https://minedb31.firebaseio.com/.json', function(data) {
			dbObj = data;
			localStorage.setItem('dbObj', JSON.stringify(dbObj));
		});
		debugLogPrint(['connStatusSwitch offline', dbObj]);
	}
}

//function to find k/v by path
function deepFind(dbObj, path, splitter) {
	console.log('%c deepFind path', 'color: pink;', path);
	console.log('%c deepFind len', 'color: pink;', path.length);
	if(path.length == 1) 
	return dbObj;
	else{
		path = path.split(splitter);
		len = path.length; 
		console.log('%c deepFind path', 'color: pink;', path);
		console.log('%c deepFind len', 'color: pink;', len);
		for (var i=0; i < len-1; i++){
			console.log('%c deepFind path[i]', 'color: pink;', path[i]);
			console.log('%c deepFind dbObj[path[i]', 'color: pink;', dbObj[path[i]]);
			dbObj = dbObj[path[i]];
		};
		return dbObj;
	}
};