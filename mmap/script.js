/*
function parse() {
	xhr = new XMLHttpRequest();
	xhr.open("get", "data.json", true);

}

function myCallbackFunction() {
	if (xhr.readyState == 4 && xhr.status == 200) {
		data = JSON.parse(xhr.responseText);
		var result = "";
		for (i = 0; i < data.length; i++) {
			result += "<p>" + data[i].content + " - " + data[i].username + "</p>";
		}
		document.getElementById("messages").innerHTML = result;
	}
}

*/

//////////////////////////////////////////////////////////////////

var login = "RonConnelly";
var myLat = 0;
var myLng = 0;
var request = new XMLHttpRequest();
var me = new google.maps.LatLng(myLat, myLng);
var myOptions = {
			zoom: 13, // The larger the zoom number, the bigger the zoom
			center: me,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
var map;
var marker;
var data;
var infowindow = new google.maps.InfoWindow();
var places;

function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	console.log("Call before getMyLocation()");
	getMyLocation();
	console.log("Call after getMyLocation()");

	// making XML request
	request.open("post", "https://secret-about-box.herokuapp.com/sendLocation", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = parse;
	request.send("login=" + login + "&lat=" + myLat + "&lng=" + myLng);
}


function parse() {
	if (request.readyState == 4 && request.status == 200) {
		data = JSON.parse(request.responseText);
		console.log(data);
		console.log(data['error']);
	}
}


function getMyLocation() {
	console.log("In getMyLocation()");
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			console.log("myLat: " + myLat);
			console.log("myLng: " + myLng);
			renderMap();
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
	console.log("Leaving getMyLocation()");
}

function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);
	
	// Update map and go there...
	map.panTo(me);


	// Create marker for self
	marker = new google.maps.Marker({
		position: me,
		title: data[0].login,
		map: map
	});
	
		
	// Open info window on click of marker
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});


	// Add markers for all people, skipping self
	if (data['error'] == undefined) {
		alert("Found people!");
		for (var i = 1; i < data.length; i++) {
			createMarker(data[i]);
		}
	}
}

function createMarker(place)
{
	// console.log(place.login);
	var placeLoc = new google.maps.LatLng(place.lat, place.lng);
	var marker = new google.maps.Marker({
		map: map,
		position: placeLoc,
		title: place.login
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.close();
		var d = distanceToMe(place);
		infowindow.setContent(place.login + ": " + d + " miles away");
		infowindow.open(map, this);
	});
}

function distanceToMe(place) {
	// transfer variables
	var lat1 = myLat;
	var lon1 = myLng;
	var lat2 = place.lat;
	var lon2 = place.lng;

	// calculations
    var R = 6371; // km 
    //has a problem with the .toRad() method below.
    var dLat = toRad(lat2-lat1);  
    var dLon = toRad(lon2-lon1);  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 

	return d.toFixed(4);
}

function toRad(x) {
	return x * Math.PI / 180;
}