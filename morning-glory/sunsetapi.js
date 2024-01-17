//demo using https://sunrisesunset.io/api/
const now = new Date();
console.log(now); //your date object

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(processLocation, locationError);
}else{
	console.log("Sorry, gelocation is not supported")
}

function processLocation(pos) {
	const crd = pos.coords;
	console.log("Your current position is:");
	console.log(`Latitude: ${crd.latitude}`);
	console.log(`Longitude: ${crd.longitude}`);
	getSunsetData( crd.latitude, crd.longitude)
}

function locationError(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getSunsetData(lat, lon){
	const todayurl = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}`
	const yesterdayurl = `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&date=yesterday` 
	
	Promise.all([
		fetch(todayurl),
		fetch(yesterdayurl)
	]).then(function (responses) {
		// Get a JSON object from each of the responses
		return Promise.all(responses.map(function (response) {
			return response.json();
		}));
	}).then(function (data) {
		// You would do something with both sets of data here
		processData(data);
	}).catch(function (error) {
		// if there's an error, log it
		console.log(error);
	});
}


function processData(data){
	console.log(data);
	let todayData = data[0].results;
	let yesterdayData = data[1].results;

	//default to showing yesterday’s data, since we’re relying on the
	//previous day’s sunset time to calculate today’s bloomtime.
	let this_data = yesterdayData; 
	
	// console.log(yesterdayData.date, yesterdayData.sunset)
	let sunsetString = this_data.sunset;
	let sunsetTime = new Date(this_data.date+' '+this_data.sunset);
	let bloomTime = new Date( sunsetTime.getTime() + hoursToMS(9) );	
	let closeTime = new Date( bloomTime.getTime() + hoursToMS(6) );

	//but if it’s past yeserday’s close time, show today’s data
	if( now > closeTime ){
		this_data = todayData;
		//recalculate datapoints
		sunsetTime = new Date(this_data.date+' '+this_data.sunset);
		bloomTime = new Date( sunsetTime.getTime() + hoursToMS(9) );	
		closeTime = new Date( bloomTime.getTime() + hoursToMS(6) );	
	}


	let duskDiv = document.getElementById('dusk');
	duskDiv.innerText = this_data.sunset;

	let bloomDiv = document.getElementById('bloom');
	bloomDiv.innerText = bloomTime.toLocaleTimeString('default', { timeStyle: 'short', timeZone: this_data.timezone });

	let closeDiv = document.getElementById('close');
	closeDiv.innerText = closeTime.toLocaleTimeString('default', { timeStyle: 'short', timeZone: this_data.timezone });

	const body = document.body;
	const statusDiv = document.getElementById('status');
	//update the flower status
	if( now >= bloomTime && now < closeTime ){
		body.dataset.flower = "bloom";
		console.log('flower should be blooming');
		statusDiv.innerText = "Open";
	}else{
		body.dataset.flower = "closed";
		statusDiv.innerText = "Closed";
	}

}

function hoursToMS( hours ){
	//given a number of hours, returns the equivalent milliseconds
	return hours * 60 * 60 * 1000;
}




