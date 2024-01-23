//I’m setting up my data object
//directly in my script file here
let colors = {
	"red":{
		"r": 255,
		"g": 0,
		"b": 0
	},
	"green":{
		"r": 0,
		"g": 255,
		"b": 0
	},
	"blue":{
		"r": 0,
		"g": 0,
		"b": 255
	}
}

console.log(colors);


window.onload = (event) => {
//we have to wait till the page loads, because we need our elements to be ready and available

	let redElement = document.getElementById('red');
	let greenElement = document.getElementById('green');
	let blueElement = document.getElementById('blue');

	//get red color formula 
	let redColor = colors.red;
	console.log(redColor);
	//build the RGB string. using the `` and the ${} syntax helps us concatenate strings and variables
	//note the `` marks are different from the '' or "" prime marks that wrap strings.
	let redColorString = `rgb(${redColor.r}, ${redColor.g}, ${redColor.b})`;
	redElement.style.color = redColorString;

	//do the same with the others
	let greenColor = colors.green;
	let greenColorString = `rgb(${greenColor.r}, ${greenColor.g}, ${greenColor.b})`;
	greenElement.style.color = greenColorString;

	//do the same with the others
	let blueColor = colors.blue;
	let blueColorString = `rgb(${blueColor.r}, ${blueColor.g}, ${blueColor.b})`;
	blueElement.style.color = blueColorString;

}
/*---
note: coloring elements like this in JavaScript is a bit silly — you can just do this in CSS! 
but this maybe helpful if you’re setting up dynamic colors that respond to some kind of calculation,
or responds to data somehow.
--*/
