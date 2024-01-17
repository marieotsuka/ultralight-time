console.log('hi! this is my script'); //this should show up on your console

//Date manipulations
const now = new Date(); //this is a UTC date object
const nydate = new Date(showNYTime(now));
function showNYTime(date){
  return date.toLocaleString('en-US', {timeZone: 'America/New_York'});
}

// get difference between newyork timezone and local timezone
const diff = now.getTime() - nydate.getTime(); 

function getNYTime(date) {
  return new Date(date.getTime() + diff);
}

const day1start = getNYTime( new Date('2024-01-14 13:00') ); 
const day1end = getNYTime( new Date('2024-01-14 17:00') ); 

const day2start = getNYTime( new Date('2024-01-21 12:00' ));
const day2end = getNYTime( new Date('2024-01-21 16:00' ));

const day3start = getNYTime( new Date('2024-01-28 13:00' ));
const day3end = getNYTime( new Date('2024-01-28 17:00' ));

console.log('Now in NY', showNYTime(now));

window.addEventListener('load', function(){
  //ony run these scripts after the site contents have loaded
  //show current time in New York
  let timeDiv = document.getElementById('current');
  timeDiv.innerText = showNYTime(now);
  //if date is one of the dates
  let session = false;
  if( now > day1start && now < day1end ){
    console.log('week 1 workshop in session');
    session = true    
  }else if ( now > day2start && now < day2end ){
    console.log('week 2 workshop in session');
    session = true 
  }else if( now > day3start && now < day3end ){
    console.log('week 3 workshop in session');
    session = true 
  }else{
    console.log('fruitful school is not in session');  
    session = false
  }

  const body = document.body;
  if( session ){
    body.dataset.status = "yes"
  }

});
