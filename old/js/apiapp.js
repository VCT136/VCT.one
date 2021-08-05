/**
 * This JavaScript file provides functionality to the "There_Is" app under the condition that JQuery and Leaflet are correctly installed.
 * 
 * Author: VCT [Vincent Busch], the respective authors of the APIs and JS extensions used in the code
 * 
 * Requirements: JQuery, LeafletJS
 * 
 * APIs used: LeafletJS, OpenStreetMap, Stamen Design, COVID19API.com, GeoNames.org, OpenWeatherMap
 */

//$ is JQuery's function for DOM manipulation, taking selectors as a parameter to get their element references, which can then be assigned different event handling methods.
//The ready function is executed when the file is loaded.
$(document).ready( function() {

	//Leaflet is an API for displaying maps and is loaded through a linked script in the html file.
	//It provides the variable L for all it's functionality (creating maps, adding content to them)
	
	//create LeafletJS map
	map = L.map("map", {
        center: [53.21629, 6.56213],
		zoom: 10,
		attributionControl: true,
		doubleClickZoom: false,
		worldCopyJump: true
	});

	//load map data  by OpenStreetMap contributors
	tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data and tiles: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors (<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>)'
	});
	tileLayer.addTo(map);

	//load artistic map data by Stamen Design
	artTileLayer = L.tileLayer("http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", {
		attribution: 'Map tiles: <a href="http://stamen.com">Stamen Design</a> (<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>)',
		maxZoom: 15,
		opacity: 0.5
	});
	artTileLayer.addTo(map);

	//add marker in the center
	marker = L.marker(map.getCenter());
	marker.addTo(map);

	//add event handling funtions to map
	map.on("moveend", onMapMoveEnd);
	map.on("click", onMapClick);

	//call function once to run initially
	onMapMoveEnd();
});

/**
 * Load amount of confirmed COronaVIrus-Desease-2019 cases of a country using the API from COVID19API.com.
 * @param {*} countryName name of the country
 * @param {*} callback the callback function; receives one parameter with the server response
 */
function getCovid19CasesByCountry (countryName, callback) {
	$.ajax({
		type: "get",
		url: "https://api.covid19api.com/country/" + countryName.toLowerCase() + "/status/confirmed",
		data: "data",
		dataType: "json",
		success: function (response) {
			callback(response);
		},
		error: function (xhr, textStatus, thrownError) {
			callback(xhr.status + ": " + thrownError);
		}
	});
}



/**
 * Load information about a nearby location from geonames.org and then work with it in a callback function.
 * @param {Number} lat the location's latitude 
 * @param {Number} lon the location's longitude
 * @param {Function} callback the callback function; receives one parameter with the server response 
 */
function getPlaceAtLocation (lat, lon, callback) {
	$.ajax({
		type: "get",
		url: "http://api.geonames.org/findNearbyJSON?lat=" + lat + "&lng=" + lon + "&username=vct136",
		success: function (response) {
			callback(response.geonames[0]);
		},
		error: function (xhr, textStatus, thrownError) {
			callback(xhr.status + ": " + thrownError);
		}
	});
}

/**
 * Load weather information about the location from openweathermap.org and then work with it in a callback function.
 * @param {Number} latitude the location's latitude 
 * @param {Number} longitude the location's longitude
 * @param {Function} callback the callback function; receives one parameter with the server response 
 */
function getWeatherAtLocation(latitude, longitude, callback) {
	$.ajax({
        type: "get",
        url: "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&APPID=d1431ed056b0dbac893ba872f9267fa6&units=metric",
        dataType: "json",
        success: function (response) {
			if (response.cod == "200") {
				callback(response);
			}
			else {
				callback("Error: An error occurred trying to load weather information. OpenWeatherMap.org's API may be unreachable. Please try again later.");
			}
		},
		error: function (xhr, textStatus, thrownError) {
			callback(xhr.status + ": " + thrownError);
		}
    });
}

/**
 * Load information about the location's nearby Wikipedia entries from wikipedia.org and then work with it in the jsonpWikiCallback function.
 * @param {Number} latitude the location's latitude 
 * @param {Number} longitude the location's longitude
 */
function getWikiAtLocation(latitude, longitude) {
	$.ajax({
        type: "get",
        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gsradius=10000&gscoord=" + latitude + "|" + longitude,
		dataType: "jsonp",
		jsonpCallback: "jsonpWikiCallback"
    });
}

/**
 * This function handles the data retrieved from the Wikipedia API geosearch.
 * For some reason it is necessary to use this parsed json format here. Else I'd get an error from the server with access-control-origin or something...
 * @param {Object} data the query result from Wikipedia API geosearch
 */
function jsonpWikiCallback(data) {
	$("#wiki-info").html("The following Wikipedia articles are near this location:<br><br><ul>");
	let results = data.query.geosearch;
	for (let i = 0; i < results.length; i++) {
		$("#wiki-info").html($("#wiki-info").html() + "<li><a href='https://en.wikipedia.org/wiki/" + results[i].title + "' target='_blank'>" + results[i].title + "</a> (" + Math.round(results[i].dist) + "m)</li>");
	}
}

/**
 * This function is called when you click on the map.
 * @param {Object / MouseEvent} mouseEvent The mouse event object should be automatically passed to this function by the map object.
 */
function onMapClick(mouseEvent) {
	//place the marker where you clicked
	marker.setLatLng(mouseEvent.latlng);
	//center the map around that location
	map.flyTo(mouseEvent.latlng);
}

/**
 * This function is called when the map stops moving.
 */
function onMapMoveEnd () {

	//update the coordinates displayed under the map
	if (map.getCenter().lat >= 0 && map.getCenter().lng >= 0) {
		$("#map-info").html("The marked location is at " + Math.round(map.getCenter().lat) + "° North and " + Math.round(map.getCenter().lng) + "° East.");
	}
	else if (map.getCenter().lat < 0 && map.getCenter().lng >= 0) {
		$("#map-info").html("The marked location is at " + -1 * Math.round(map.getCenter().lat) + "° South and " + Math.round(map.getCenter().lng) + "° East.");
	}
	else if (map.getCenter().lat >= 0 && map.getCenter().lng < 0) {
		$("#map-info").html("The marked location is at " + Math.round(map.getCenter().lat) + "° North and " + -1 * Math.round(map.getCenter().lng) + "° West.");
	}
	else {
		$("#map-info").html("The marked location is at " + -1 * Math.round(map.getCenter().lat) + "° South and " + -1 * Math.round(map.getCenter().lng) + "° West.");
	}

	//display loading messages for GeoNames.org
	$("#place-info").html("Connecting to the GeoNames.org API...");
	$("#covid19-info").html("Connecting to the GeoNames.org API...");

	//get place data from GeoNames.org
	getPlaceAtLocation(map.getCenter().lat, map.getCenter().lng, function(geoNamesData) {
		
		//if they send an object with toponymName property we can use it, else something went wrong
		if (geoNamesData.toponymName) {
			//display data about the nearby toponym
			$("#place-info").html("Here: " + geoNamesData.toponymName + " (about " + Math.round(geoNamesData.distance * 100) + "0m from the marked location)<br>");

			//if they send an adminName1, we can be sure to have a country and region for this location
			if (geoNamesData.adminName1) {
				//display country and region
				$("#place-info").html($("#place-info").html() + "Region: " + geoNamesData.adminName1 + ", " + geoNamesData.countryName);
				
				//display loading message
				$("#covid19-info").html("Connecting to the COVID19API.com API...");

				//use the country from GeoNames.org to get COVID19 data from COVID19API.com
				getCovid19CasesByCountry(geoNamesData.countryName, function (covid19Data) {

					//if they return an object the API call was successful
					if (typeof(covid19Data) == "object") {
						//filter the covid 19 data to sort out entries about overseas territories and similar regions
						covid19Data = covid19Data.filter(function (entryObject) {
							return typeof(entryObject.Province) == "undefined";
						});
						//display the latest amount of confirmed cases in the country
						$("#covid19-info").html("COVID19 information: " + covid19Data[covid19Data.length - 1].Cases + " confirmed cases in this country.");
					}
					else {
						//display error message
						$("#covid19-info").html("Error connecting to COVID19API.com: <b>" + covid19Data + "</b>");
					}
				});
			}
			else {
				//display error message
				$("#place-info").html($("#place-info").html() + "Region: This place does not seem to belong to any Region.");
			}
		}
		else {
			//display error messages
			$("#place-info").html("Error connecting to the GeoNames.org API: <b>" + geoNamesData + "</b>");
			$("#covid19-info").html("Error connecting to the GeoNames.org API: <b>" + geoNamesData + "</b>");
		}
	});

	//display loading messages for OpenWeatherMap.org
	$("#weather-info").html("Connecting to the OpenWeatherMap API...");

	//get weather data from OpenWeatherMap.org
	getWeatherAtLocation(map.getCenter().lat, map.getCenter().lng, function(weatherData) {
		//if we get an object with a weather property we can work with that data, else something wentt wrong
		if (weatherData.weather) {
			
			//display weather data
			$("#weather-info").html(
				"<img class='icon' src='http://openweathermap.org/img/wn/" + weatherData.weather[0].icon + "@2x.png' alt='weather icon' />" + weatherData.weather[0].description +
				"<br>Temperature: " + weatherData.main.temp + "°C" +
				"<br>Humidity: " + weatherData.main.humidity + "%" +
				"<br>Wind Speed: " + weatherData.wind.speed + "m/s"
			);
		
		}
		else {
			//display error message
			$("#weather-info").html("Error connecting to the OpenWeatherMap API: <b>" + weatherData + "</b>");
		}
	});

	//get and display wikipedia info
	getWikiAtLocation(map.getCenter().lat, map.getCenter().lng);

	//set the marker to the center of the map
	marker.setLatLng(map.getCenter());
}

/**
 * This function shows / hides an element by fading it in / out.
 * @param {String} elementId The css selector for the element you want to show / hide by fading. 
 */
function showOrHideElement (elementId) {
	if ($(elementId).css("display") == "none") {
		$(elementId).fadeIn();
	}
	else {
		$(elementId).fadeOut();
	}
}