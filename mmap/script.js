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
var myMarker;
var data;
var infowindow = new google.maps.InfoWindow();
var places;

function init()
{
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	getMyLocation();


}


function getMyLocation() {
	if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();

			// making XML request
			request.open("post", "https://secret-about-box.herokuapp.com/sendLocation", true);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.onreadystatechange = dataReady;
			request.send("login=" + login + "&lat=" + myLat + "&lng=" + myLng);
		});
	}
	else {
		alert("Geolocation is not supported by your web browser.  What a shame!");
	}
}

function dataReady() {
	if (request.readyState == 4 && request.status == 200) {
		data = JSON.parse(request.responseText);
		// Add markers for all people, skipping self
		for (var i = 0; i < data.length; i++) {
			if (data[i].login != "RonConnelly") {
				createMarker(data[i]);
			}
		}
	}
}


function renderMap()
{
	me = new google.maps.LatLng(myLat, myLng);
	
	// Update map and go there...
	map.panTo(me);


	// Create marker for self
	var image = 'minion_small.png'
	myMarker = new google.maps.Marker({
		position: me,
		title: "RonConnelly",
		map: map,
		icon: image
	});
	
	infowindow.setContent("Logged in!");
	infowindow.open(map, myMarker);

	google.maps.event.addListener(myMarker, 'click', function() {
		infowindow.close();
		infowindow.setContent(myMarker.title);
		infowindow.open(map, myMarker);
	});

}

function createMarker(place)
{
	var placeLoc = new google.maps.LatLng(place.lat, place.lng);
	var marker = new google.maps.Marker({
		map: map,
		position: placeLoc,
		title: place.login
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.close();
		var d = distanceToMe(place);
		infowindow.setContent(marker.title + ": " + d + " miles away");
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