const now = new Date();
console.log(now); 

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
/*---
based on the IANA (Internet Assigned Numbers Authority) Timezone database
https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
---*/
console.log(tz);

window.addEventListener('load', function(){
	//ony run these scripts after the site contents have loaded
	getWeatherData();
});


function getWeatherData(){
	const appId = 'a0be2ca7d3101a5b3e8a3bbf580143f6';
	let cityName = tz.split('/')[1].replace('_', ' ');
	console.log(cityName); 
	//we’ll use a ballpark location with timezone info
	//see other API demo for getting longitude/latitude info from visitor
	// if( lat && lon ){
	// 	url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;
	// }
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appId}&units=imperial`;
	
	fetch(url)
		.then(response => response.json())
		.then(data => {
			if( data.cod == '404' ){
				//error in getting data, display error
				console.log( data.message );
			}else{
				processWeatherData(data);
			}      
		})
		.catch(error => console.log(error));
}

function processWeatherData(data){
	console.log(data);

	const temp = data.main.temp;
	const utcSunsetMS = data.sys.sunset * 1000; 
	const utcSunriseMS = data.sys.sunrise * 1000; 
	//UNIX timestamps are in seconds, but JS uses milliseconds
	
	//add 9 hours in seconds
	let utcBloomMS = utcSunsetMS + hoursToMS(9);
	//9hour * 60 min/hour * 60sec/min * 1000ms/sec
	let sunsetTime = new Date(utcSunsetMS);
	let sunriseTime = new Date(utcSunriseMS);

	if( now < sunsetTime){
		/*-- if we are looking at the site before today’s sunset, 
		let’s use the previous day’s sunset time instead by subtracting 24hours 
		though technically, we should pull new data for that particular date, 
		since sunset times change a little bit every day..
		--*/
		utcBloomMS = utcBloomMS - hoursToMS(24);
	}

	let bloomTime =  new Date(utcBloomMS); 

	let duration = 6 // default to 6 hours of bloom time
	// we can adjust the bloom duration according to the temperature
	if ( temp < 50 ){
		duration = 0
	}else	if( temp < 80 ){
		duration = 6
	}else if ( temp < 90){
		duration = 3
	}else{
		duration = 0
	}
	let closeTime = new Date(utcBloomMS + hoursToMS(duration)); // assume 6 hours of bloom time


	// console.log(sunsetTimeString, bloomTimeString);
	let nowDiv = document.getElementById('now');
	nowDiv.innerText = convertToString( now );

	let duskDiv = document.getElementById('dusk');
	duskDiv.innerText = convertToString( sunsetTime );

	let bloomDiv = document.getElementById('bloom');
	bloomDiv.innerText = convertToString( bloomTime );

	let closeDiv = document.getElementById('close');
	closeDiv.innerText = convertToString( closeTime );

	let tempDiv = document.getElementById('temp');
	tempDiv.innerText = temp+'F';
	

	//check if flower should be blooming
	console.log(now, bloomTime);

	const body = document.body;
	const statusDiv = document.getElementById('status');
	//update the flower status
	if( now >= bloomTime && now < closeTime ){
		body.dataset.flower = "bloom";
		statusDiv.innerText = "Open";
	}else{
		body.dataset.flower = "closed";
		statusDiv.innerText = "Closed";
	}

	//update the background colors
	if( now < sunriseTime ){
		body.dataset.mode = "beforedawn";
	}else if( now > sunriseTime && now < sunsetTime ){
		body.dataset.mode = "day";
	} else{
		body.dataset.mode = "afterdusk";
	}

}

function hoursToMS( hours ){
	//given a number of hours, returns the equivalent milliseconds
	return hours * 60 * 60 * 1000;
}

function convertToString( date ){
	/*--see this reference for formatting options:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options
	--*/
	return date.toLocaleTimeString('default', { timeStyle: 'short', timeZone: tz })
}